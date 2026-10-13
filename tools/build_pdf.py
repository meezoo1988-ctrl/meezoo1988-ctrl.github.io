"""Regenerate Mazen_Hamdan_CV.pdf from cv.html so the download always matches the page.

Usage (from anywhere):  python3 tools/build_pdf.py
Needs: pip install playwright && python3 -m playwright install chromium

The page is served over a local HTTP server (not file://) so the page's
Content-Security-Policy allows the self-hosted TrueType fonts, which keeps the
PDF text cleanly extractable by ATS parsers.
"""
import functools
import http.server
import pathlib
import threading

from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parent.parent
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(root))
server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{server.server_address[1]}/cv.html"

try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url, wait_until="load")
        page.emulate_media(media="print")
        page.evaluate("document.fonts.ready")
        page.pdf(path=str(root / "Mazen_Hamdan_CV.pdf"), format="A4",
                 print_background=True, prefer_css_page_size=True)
        browser.close()
finally:
    server.shutdown()
print("Wrote", root / "Mazen_Hamdan_CV.pdf")
