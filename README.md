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

The deployment workflow builds the project and publishes `dist/` through GitHub Actions. In the repository, select **Settings → Pages → Build and deployment → Source → GitHub Actions**. The expected project URL is `https://sanyo4ever.github.io/tracker-count/`.

**Current deployment blocker:** the repository is private, and GitHub rejected Pages setup because the account's current plan does not support Pages for this repository. Keep it private and use an eligible paid plan, or explicitly authorize changing its visibility to public before enabling Pages. The site is not live until deployment succeeds.

The social preview is `public/og-image.png` (1200 × 630), with an editable, font-embedded SVG source alongside it.
