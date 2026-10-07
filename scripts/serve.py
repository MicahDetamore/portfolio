#!/usr/bin/env python3
"""
Dev server for Portfolio site.

Two-pronged cache-busting strategy so changes are immediately visible on
mdetamore.com without ever needing to purge the Cloudflare cache:

1. Cache-Control: no-store on every response (tells Cloudflare not to cache).
2. For HTML files, all CSS/JS <link>/<script> src/href attributes have a
   ?v=<unix-timestamp> query string injected at serve time. Even if Cloudflare
   ignores the no-store header for static assets, it will always see a URL it
   has never cached before and must fetch the latest file from origin.
"""
import http.server
import os
import re
import time

PORT = 8000
DIRECTORY = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Matches local (non-http) src/href values in <link> and <script> tags.
# Uses a non-greedy path group then an optional query-string group so that
# hrefs like 'favicon.svg?v=5' and plain 'style.css' are both captured.
_ASSET_RE = re.compile(
    r'((?:href|src)=")(?!https?://)([^"?]+?\.(?:css|js|svg|ico|png))(?:\?[^"]*)?(")',
    re.IGNORECASE,
)


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self):
        # Only rewrite HTML files; everything else is served normally.
        clean_path = self.path.split("?")[0].rstrip("/")
        is_html = clean_path == "" or clean_path.endswith(".html") or "." not in os.path.basename(clean_path)

        if not is_html:
            super().do_GET()
            return

        # Resolve the file path the same way the base class would.
        file_path = self.translate_path(self.path)
        if os.path.isdir(file_path):
            file_path = os.path.join(file_path, "index.html")
        if not os.path.isfile(file_path):
            super().do_GET()
            return

        with open(file_path, "rb") as f:
            content = f.read().decode("utf-8", errors="replace")

        ts = str(int(time.time()))
        def add_version(m):
            url = m.group(2)  # path only, no query string
            return m.group(1) + url + "?v=" + ts + m.group(3)

        content = _ASSET_RE.sub(add_version, content)
        body = content.encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    with http.server.ThreadingHTTPServer(("", PORT), NoCacheHandler) as httpd:
        httpd.allow_reuse_address = True
        print(f"Serving http://localhost:{PORT}  (no-cache + asset versioning)", flush=True)
        httpd.serve_forever()
