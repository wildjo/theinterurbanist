# The Interurbanist — Jekyll on GitHub Pages

Minimal, senior-friendly site with two collections (longform, shortform), timeline/sections modes,
large tap targets, and placeholder art. Uses Noto Sans.

## Quick start

1. Create the repo `theinterurbanist` under `wildjo` and upload these files.
2. In Settings → Pages:
   - Build and deployment: **GitHub Pages**.
   - Source: **Deploy from a branch** (main), or GitHub Actions (either works for allowed plugins).
3. Your site will be served at `https://wildjo.github.io/theinterurbanist/`.

If you convert to a user site later (`wildjo.github.io`), set `baseurl: ""` in `_config.yml`.

## Content
- Add long articles to `_longform/` with front matter `section: longform`.
- Add bulletins to `_shortform/` with `section: shortform`.
- `expires_on` (YYYY-MM-DD) hides stale shortform items automatically on the home page.
- Images live in `assets/img/`.
- Videos are links in front matter: `videos: [{ platform: youtube, url: "...", description: "..." }]`.

## Feed
Site feed at `/feed.xml` includes both collections.

## Fonts
Noto Sans is loaded from Google Fonts in `_includes/head.html`. Replace as desired.

## License
Do whatever you want. Be kind to your neighbors.
