#!/usr/bin/env python3
"""Create or update a DRAFT post/page on casheshair.com via the WP REST API.

Auth comes from environment variables (never hardcode, never commit):
  WP_URL           default https://casheshair.com
  WP_USERNAME      the WordPress username the Application Password belongs to
  WP_APP_PASSWORD  an Application Password for that user (spaces ok)

Usage:
  python3 seo/scripts/wp_publish.py --title "..." --content-file post.html \
      [--type post|page] [--slug my-slug] [--excerpt "..."] [--update-id 123]
  python3 seo/scripts/wp_publish.py --check   # verify credentials only

Everything is created with status=draft. Publishing to live is a human
action in wp-admin, by design.

SiteGround's hosting intermittently interposes a proof-of-work anti-bot
challenge on authenticated requests; sg_challenge.py solves it and the
request is retried automatically (cookies persist for the process).
"""
import argparse, base64, json, os, sys, urllib.request, urllib.error
from http.cookiejar import CookieJar

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sg_challenge

BASE = os.environ.get("WP_URL", "https://casheshair.com").rstrip("/")
_jar = CookieJar()
_opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(_jar))
_opener.addheaders = [("User-Agent",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/126.0.0.0 Safari/537.36")]


def _raw(url, data=None, headers=None, method=None):
    req = urllib.request.Request(url, data=data, method=method)
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    try:
        with _opener.open(req, timeout=60) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")


def _plain_fetch(url):
    return _raw(url)


def api(path, payload=None, method=None):
    user = os.environ.get("WP_USERNAME")
    pw = os.environ.get("WP_APP_PASSWORD")
    if not user or not pw:
        sys.exit("Missing WP_USERNAME / WP_APP_PASSWORD environment variables. "
                 "See seo/RUNBOOK.md.")
    token = base64.b64encode(f"{user}:{pw}".encode()).decode()
    url = f"{BASE}/wp-json/wp/v2/{path}"
    headers = {"Authorization": f"Basic {token}",
               "Content-Type": "application/json"}
    body = json.dumps(payload).encode() if payload is not None else None
    m = method or ("POST" if payload is not None else "GET")

    for attempt in range(4):
        status, text = _raw(url, data=body, headers=headers, method=m)
        if sg_challenge.is_challenge(status, text):
            print("(anti-bot challenge detected — solving proof-of-work...)",
                  file=sys.stderr)
            sg_challenge.pass_challenge(_plain_fetch, BASE, text)
            continue
        if status >= 400:
            sys.exit(f"WordPress API error {status}: {text[:500]}")
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            sys.exit(f"Unexpected non-JSON response ({status}): {text[:300]}")
    sys.exit("Could not get past the anti-bot challenge after 4 attempts. "
             "Retry in a minute; egress IP rotation can cause this.")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--check", action="store_true", help="verify credentials")
    p.add_argument("--title")
    p.add_argument("--content-file")
    p.add_argument("--type", default="post", choices=["post", "page"])
    p.add_argument("--slug")
    p.add_argument("--excerpt")
    p.add_argument("--update-id", type=int, help="edit an existing draft by ID")
    a = p.parse_args()

    if a.check:
        me = api("users/me?context=edit")
        print(f"OK — authenticated as '{me.get('name')}' "
              f"(roles: {', '.join(me.get('roles', []))})")
        return

    if not a.title or not a.content_file:
        p.error("--title and --content-file are required (or use --check)")
    with open(a.content_file, encoding="utf-8") as f:
        content = f.read()

    payload = {"title": a.title, "content": content, "status": "draft"}
    if a.slug:
        payload["slug"] = a.slug
    if a.excerpt:
        payload["excerpt"] = a.excerpt

    endpoint = f"{a.type}s"
    result = api(f"{endpoint}/{a.update_id}" if a.update_id else endpoint, payload)

    print(json.dumps({
        "id": result["id"],
        "status": result["status"],
        "edit_link": f"{BASE}/wp-admin/post.php?post={result['id']}&action=edit",
        "preview": result.get("link"),
    }, indent=2))


if __name__ == "__main__":
    main()
