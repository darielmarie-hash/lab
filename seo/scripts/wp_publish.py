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
"""
import argparse, base64, json, os, sys, urllib.request, urllib.error


def api(path, payload=None, method=None):
    base = os.environ.get("WP_URL", "https://casheshair.com").rstrip("/")
    user = os.environ.get("WP_USERNAME")
    pw = os.environ.get("WP_APP_PASSWORD")
    if not user or not pw:
        sys.exit("Missing WP_USERNAME / WP_APP_PASSWORD environment variables. "
                 "See seo/RUNBOOK.md.")
    token = base64.b64encode(f"{user}:{pw}".encode()).decode()
    req = urllib.request.Request(
        f"{base}/wp-json/wp/v2/{path}",
        data=json.dumps(payload).encode() if payload is not None else None,
        headers={"Authorization": f"Basic {token}",
                 "Content-Type": "application/json",
                 "User-Agent": "cashes-seo-team/1.0"},
        method=method or ("POST" if payload is not None else "GET"),
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"WordPress API error {e.code}: {e.read().decode()[:500]}")


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
    if a.update_id:
        result = api(f"{endpoint}/{a.update_id}", payload)
    else:
        result = api(endpoint, payload)

    base = os.environ.get("WP_URL", "https://casheshair.com").rstrip("/")
    print(json.dumps({
        "id": result["id"],
        "status": result["status"],
        "edit_link": f"{base}/wp-admin/post.php?post={result['id']}&action=edit",
        "preview": result.get("link"),
    }, indent=2))


if __name__ == "__main__":
    main()
