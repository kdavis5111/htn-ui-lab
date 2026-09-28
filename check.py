#!/usr/bin/env python3
"""Lab rules check. Run before every push:  python3 check.py

It answers one question: did this change touch only the LOOK of the page?
The news content must stay exactly as it was in baseline/.
"""
import html as htmllib
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
problems = []


def read(p):
    with open(os.path.join(ROOT, p), encoding="utf-8") as f:
        return f.read()


def text_items(page):
    """Every headline, fact sentence and source name in the page, as plain text."""
    items = []
    for cls in ("headline", "fact-text", "src"):
        for m in re.finditer(r'class="%s[^"]*"[^>]*>(.*?)</' % cls, page, re.S):
            t = htmllib.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()
            if t:
                items.append(t)
    return items


# 1. baseline/ must be untouched (compare against git HEAD of main if possible)
for f in ("index.html", "style.css", "app.js", "lab.css"):
    if not os.path.exists(os.path.join(ROOT, "baseline", f)):
        problems.append(f"baseline/{f} is missing. Never delete or edit baseline/.")

# 2. every piece of news in the baseline must still be in index.html
if os.path.exists(os.path.join(ROOT, "baseline", "index.html")):
    base_items = text_items(read("baseline/index.html"))
    now = read("index.html")
    now_flat = htmllib.unescape(re.sub(r"<[^>]+>", " ", now))
    now_flat = re.sub(r"\s+", " ", now_flat)
    missing = [t for t in base_items if re.sub(r"\s+", " ", t) not in now_flat]
    if missing:
        problems.append(
            "%d news items from baseline are missing or reworded in index.html. "
            "First few: %s" % (len(missing), missing[:3])
        )
    base_stories = read("baseline/index.html").count('class="story"')
    now_stories = now.count('class="story"')
    if now_stories != base_stories:
        problems.append(f"story count changed: baseline {base_stories}, now {now_stories}. Do not add or remove stories.")

# 3. no outside scripts or stylesheets except the allowed CDNs
page = read("index.html")
allowed = ("https://cdnjs.cloudflare.com/", "https://cdn.jsdelivr.net/npm/", "https://fonts.googleapis.com/", "https://fonts.gstatic.com/")
ext = re.findall(r'<script[^>]+src="(https?://[^"]+)"', page)
ext += re.findall(r'<link[^>]+rel="stylesheet"[^>]+href="(https?://[^"]+)"', page)
ext += re.findall(r'<link[^>]+href="(https?://[^"]+)"[^>]+rel="stylesheet"', page)
for url in ext:
    if not url.startswith(allowed):
        problems.append(f"outside script/stylesheet not allowed: {url}")

# 4. no tracking, no forms that send data anywhere new
for m in re.finditer(r'<form[^>]+action="([^"]+)"', page):
    if not m.group(1).startswith("https://buttondown.com/"):
        problems.append(f"new form target not allowed: {m.group(1)}")
for bad in ("googletagmanager", "google-analytics", "gtag(", "facebook.net", "hotjar", "segment.com"):
    if bad in page or bad in read("app.js"):
        problems.append(f"tracking code not allowed: {bad}")

# 5. nothing that looks like a secret, anywhere in the repo
secret = re.compile(r"(sk_live_|sk_test_|figd_|ghp_|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY)")
for dirpath, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in (".git", "node_modules")]
    for fn in files:
        if fn == "check.py":
            continue
        p = os.path.join(dirpath, fn)
        try:
            data = open(p, encoding="utf-8", errors="ignore").read()
        except OSError:
            continue
        if secret.search(data):
            problems.append(f"possible secret in {os.path.relpath(p, ROOT)}")
        if os.path.getsize(p) > 3_000_000:
            problems.append(f"{os.path.relpath(p, ROOT)} is over 3 MB. Keep the lab small.")

# 6. the lab banner must stay so nobody mistakes this for the real site
if 'class="lab-banner"' not in page:
    problems.append("the lab banner was removed from index.html. Put it back.")

if problems:
    print("CHECK FAILED\n")
    for p in problems:
        print(" -", p)
    sys.exit(1)
print("check passed: news content unchanged, no outside code, no secrets, banner present.")
