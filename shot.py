#!/usr/bin/env python3
"""Before/after screenshots for a pull request, with no browser tooling needed
in the agent. Uses whichever Chrome-family browser is installed (Chrome, Brave,
Edge, Chromium) in headless mode.

    python3 shot.py

Writes shots/before-phone.png, shots/after-phone.png, shots/before-desktop.png,
shots/after-desktop.png. Drag them into the PR description on GitHub.
If no browser is found it says so; then the human takes the screenshots by hand
from the page that serve.py opened.
"""
import glob
import http.server
import os
import shutil
import socketserver
import subprocess
import sys
import threading

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
os.makedirs("shots", exist_ok=True)

CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
]
for name in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "brave-browser", "microsoft-edge", "chrome"):
    found = shutil.which(name)
    if found:
        CANDIDATES.append(found)
browser = next((c for c in CANDIDATES if c and os.path.exists(c)), None)
if not browser:
    print("No Chrome, Brave, Edge or Chromium found. Run python3 serve.py and take the screenshots by hand:")
    print("  phone width (about 375px) and desktop, for both /baseline/index.html and /index.html")
    sys.exit(2)


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


httpd = socketserver.TCPServer(("127.0.0.1", 0), Quiet)
port = httpd.server_address[1]
threading.Thread(target=httpd.serve_forever, daemon=True).start()

pages = {"before": "baseline/index.html", "after": "index.html"}
sizes = {"phone": (375, 1400), "desktop": (1280, 1400)}
for label, path in pages.items():
    for size, (w, h) in sizes.items():
        out = os.path.join("shots", f"{label}-{size}.png")
        # Headless Chrome will not go narrower than about 500px, so the page is
        # framed in an iframe of the wanted width instead.
        frame = os.path.join("shots", f"_{label}-{size}.html")
        with open(frame, "w") as f:
            f.write('<!doctype html><body style="margin:0;background:#151815">'
                    f'<iframe src="/{path}" style="border:0;width:{w}px;height:{h}px"></iframe></body>')
        win_w = max(w, 520)
        cmd = [browser, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
               f"--window-size={win_w},{h}", f"--screenshot={out}", f"http://127.0.0.1:{port}/{frame}"]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=60)
        os.remove(frame)
        print("wrote", out if os.path.exists(out) else f"(failed) {out}")
httpd.shutdown()
print("Now show shots/ to your human, and attach the PNGs to the pull request.")
