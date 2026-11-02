# Yet Another Expense Tracker

A tracker for expense trackers: a static React + TypeScript + Vite site with searchable App Store and Google Play collections, a methodology page, and a deliberately fictional activity feed.

## Run locally

Use Node.js 22+ and pnpm 11.25 (the version pinned in `package.json`).

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
```

Vite builds the site into `dist/`. Its default base path is `/tracker-count/`; set `VITE_BASE_PATH=/` when hosting at a domain root. Routes use URL hashes (`#/`, `#/ios`, `#/android`, `#/about`), so static hosting does not need route rewrites.

## Catalog and verification

The collection contains **45 iOS listings and 50 Android listings**, verified on **2026-11-02**. Displayed counts are calculated from `src/data/ios.json` and `src/data/android.json`, not hardcoded estimates of either store. An app available on both platforms counts in both collections.

- **iOS:** App Store IDs and listing metadata were checked through Apple's public iTunes lookup API for the US storefront. Sources and scope are recorded in `src/data/ios-provenance.json`.
- **Android:** Official Google Play detail pages were checked for public listing metadata. Source URLs and verification results are recorded in `src/data/android-provenance.json`.

Descriptions and tags are editorial summaries. This is a curated index, not a complete store census or a test of app functionality. Availability can vary by region and device. Ratings, review counts, and prices are intentionally omitted. The activity feed is a labeled simulation.

## GitHub Pages

The deployment workflow builds the project and publishes `dist/` through GitHub Actions on every push to `main`. Site URL: [sanyo4ever.github.io/tracker-count](https://sanyo4ever.github.io/tracker-count/).

For a fork, enable **Settings → Pages → Build and deployment → Source → GitHub Actions**, then push to `main` or run the deployment workflow manually. Free GitHub Pages hosting requires a public repository. The workflow sets the Vite base path from the repository name; update the canonical and social-preview URLs in `index.html` if you deploy under a different owner or name.

The social preview is `public/og-image.png` (1200 × 630), with an editable, font-embedded SVG source alongside it.
