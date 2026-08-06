"""SiteGround anti-bot proof-of-work solver for casheshair.com.

SiteGround's hosting intermittently answers authenticated REST requests with
HTTP 202 + an HTML page containing a SHA-1 proof-of-work challenge (the
"Robot Challenge Screen"). This module solves it exactly the way the page's
own JavaScript would: find a counter such that
SHA1(challenge_bytes + minimal_bigendian_counter_bytes) starts with
<complexity> zero bits, then submit base64(message) as `sol`. The server
then sets a cookie that lets subsequent requests through.

Used by wp_publish.py automatically; no action needed. This is the site
owner's own authorized access to their own site.
"""
import base64, hashlib, re, time, urllib.parse


def is_challenge(status, body):
    return status == 202 and "sgcaptcha" in body


def _counter_bytes(n):
    if n > 0xFFFFFF: size = 4
    elif n > 0xFFFF: size = 3
    elif n > 0xFF: size = 2
    else: size = 1
    return n.to_bytes(size, "big")


def _solve(challenge, complexity):
    msg = challenge.encode()
    t0 = time.time()
    n = 0
    while True:
        m = msg + _counter_bytes(n)
        d = hashlib.sha1(m).digest()
        if int.from_bytes(d[:4], "big") >> (32 - complexity) == 0:
            return base64.b64encode(m).decode(), int((time.time() - t0) * 1000), n + 1
        n += 1


def pass_challenge(fetch, base, challenge_html):
    """fetch(url) -> (status, text). Returns True if the challenge was passed."""
    m = re.search(r'content="0;(/\.well-known/sgcaptcha/[^"]+)"', challenge_html)
    if not m:
        return False
    status, page = fetch(base + m.group(1).replace("&amp;", "&"))
    cm = re.search(r'const sgchallenge="([^"]+)"', page)
    sm = re.search(r'const sgsubmit_url="([^"]+)"', page)
    if not cm or not sm:
        return False
    challenge, submit = cm.group(1), sm.group(1)
    complexity = int(challenge.split(":", 1)[0])
    sol, elapsed, hashes = _solve(challenge, complexity)
    sep = "&" if "?" in submit else "?"
    fetch(f"{base}{submit}{sep}sol={urllib.parse.quote(sol)}&s={elapsed}:{hashes}")
    return True
