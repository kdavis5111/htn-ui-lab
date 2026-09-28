#!/usr/bin/env python3
"""Serve the lab page locally and open it in the human's own browser.

    python3 serve.py

Leaves a server running at http://localhost:8000/ (or the next free port).
Edit style.css / index.html / app.js, then refresh the browser. No caching,
no build step. Stop it with Ctrl+C.

The untouched starting point is served too, at /baseline/index.html, so the
human can put the two side by side.
"""
import http.server
import os
import socketserver
import sys
import threading
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *a):
        pass


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    for p in range(port, port + 20):
        try:
            httpd = socketserver.TCPServer(("127.0.0.1", p), Handler)
            break
        except OSError:
            continue
    else:
        sys.exit("no free port between %d and %d" % (port, port + 19))
    url = "http://localhost:%d/" % p
    print("Lab page:      ", url)
    print("Starting point:", url + "baseline/index.html")
    print("Edit, then refresh the browser. Ctrl+C stops the server.")
    if "--no-open" not in sys.argv:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
