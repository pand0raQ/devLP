# SEO Performance Audit

Date: 2026-07-13
Scope: local production build for `https://pand0raq.dev/`

## Method

- Built the site with `npm run build`
- Ran the repo audit with `npm run audit`
- Inspected generated asset sizes in `dist/`
- Reviewed image loading and third-party resource usage on key landing pages

## Summary

The site is structurally strong for SEO and weak only in media performance on secondary app pages.

- Technical SEO audit: `40/40` checks passed
- Homepage HTML: `10.71 kB` (`2.99 kB` gzip)
- Main CSS: `7.19 kB` (`2.19 kB` gzip)
- Main JS: `2.83 kB` (`1.24 kB` gzip)
- Live Core Web Vitals: not measured in this pass

## What Is Good

- Titles, descriptions, canonicals, JSON-LD, and H1 usage passed on homepage plus the two priority product pages
- `robots.txt`, `sitemap.xml`, `llms.txt`, and `llms-full.txt` are present in the build
- The site shell is lightweight; JavaScript is not the bottleneck
- `Couple Status` screenshots are already relatively small at about `235 kB` total

## Performance Risks

1. Secondary app pages ship oversized PNG screenshots.

- `breathepulse/`: about `3.41 MB`
- `pottydog/`: about `8.30 MB`
- `timecostify/`: about `1.99 MB`

2. Screenshot galleries do not use `loading="lazy"` or `decoding="async"`, so off-screen images can compete with above-the-fold content.

3. Screenshot containers do not reserve aspect ratio, which can increase layout shift risk while images load.

4. The homepage depends on Google Fonts and several off-origin app icon images, which adds DNS/TLS work before the page is visually complete.

## Priority Fixes

1. Convert screenshot PNGs to AVIF or WebP, especially on `pottydog/` and `breathepulse/`.
2. Add `loading="lazy"` and `decoding="async"` to all below-the-fold screenshots.
3. Add fixed `width` and `height` attributes or CSS `aspect-ratio` for screenshot frames.
4. Replace the Google Fonts request with a local font file or a system stack if you want the fastest first render.
5. Consider serving app icons locally instead of from Tilda CDN.

## Risk By Page

- Homepage: low risk, mostly third-party font and image origin overhead
- `couplestatus/`: low risk
- `timecostify/`: medium risk because of screenshot weight
- `breathepulse/`: high risk because a single screenshot is `3.41 MB`
- `pottydog/`: high risk because screenshot payload is `8.30 MB`

## Conclusion

SEO markup quality is in good shape. The main constraint on organic performance is not metadata or structure; it is image payload on a subset of landing pages.
