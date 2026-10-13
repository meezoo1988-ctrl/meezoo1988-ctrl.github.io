# Mazen Hamdan Portfolio

Arabic personal portfolio with a complete English CV. Static HTML, CSS and JavaScript; no build step for the site.

Live: https://meezoo1988-ctrl.github.io/ · CV: https://meezoo1988-ctrl.github.io/cv.html

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Arabic portfolio home page |
| `cv.html` | English CV (screen + print styles) |
| `Mazen_Hamdan_CV.pdf` | Downloadable CV, **generated from `cv.html`** |
| `tools/build_pdf.py` | Rebuilds the PDF from `cv.html` |
| `404.html`, `robots.txt`, `sitemap.xml` | Pages / SEO support |
| `assets/fonts/` | Self-hosted Inter (TrueType, OFL) so the PDF embeds standard fonts |

## Updating the CV

1. Edit `cv.html` (the single source of truth).
2. Rebuild the PDF so the download matches the page:
   ```
   pip install playwright && python3 -m playwright install chromium
   python3 tools/build_pdf.py
   ```
3. Check the text a recruiter's ATS will read: `pdftotext Mazen_Hamdan_CV.pdf - | less`
4. Commit and push to `main`. GitHub Pages republishes within about a minute.

The print/PDF layout is a single reading column with no letter-spacing, so ATS parsers extract each job title, date, company and bullet in the right order.

## Preview locally

```
python3 -m http.server 8000
```
then open http://localhost:8000.

## Deployment

GitHub Pages → Settings → Pages → Deploy from a branch → `main` / root. `.nojekyll` disables Jekyll processing so files are served as-is.
