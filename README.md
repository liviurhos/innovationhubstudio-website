# innovationhubstudio-website

Static site for Innovation Hub Studio Ltd, served by GitHub Pages at
innovationhubstudio.co.uk.

## Structure

- `index.html`, `portfolio.html`: studio pages
- `radio-app.html`, `just90s.html`, `collision-radar.html`: one page per app
- `privacy.html`, `terms.html`, `eula.html`: RadioLive legal documents
- `just90s-*.html`, `collision-radar-*.html`: legal documents for the other apps
- `assets/site.css`, `assets/site.js`: design tokens, navigation, footer and
  behaviour shared by every page
- `assets/home.css`, `portfolio.css`, `product.css`, `just90s.css`, `legal.css`:
  page-specific styles
- `images/web/`: right-sized copies of the images used on the pages
- `images/badges/`: the official store badges, `app-store.svg` and
  `google-play.svg`, used unmodified

Do not rename the legal pages: their URLs are registered in the app stores.

## Editing rules

- The navigation and footer must be identical on every page. Change them on
  all pages at once.
- No inline `<script>` blocks and no `onclick=` style handlers: the Content
  Security Policy blocks them. Put behaviour in `assets/site.js`.
- Run `python3 tools/check_site.py` before pushing. It checks tags, links,
  images and that the navigation matches on every page.
