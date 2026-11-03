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

Displayed counts are calculated from the unique listings in `src/data/ios.json` and `src/data/android.json`. They measure our index, not the total number of trackers in either store. Each record has its own `verifiedAt` date; adding new listings does not imply that all older entries were rechecked. An app available on both platforms counts in both collections.

- **iOS:** Discovery combines multiple terms and storefronts through Apple's public iTunes API, plus direct official listing checks. Sources, search coverage, and verification scope are recorded in `src/data/ios-provenance.json`.
- **Android:** Official Google Play detail pages were checked for public listing metadata. Source URLs and verification results are recorded in `src/data/android-provenance.json`.

Descriptions and tags are editorial summaries. Store search results are limited and vary by query and region, so this index has unknown coverage and will miss apps. No store-wide total is estimated. We include tools for logging expenses, managing budgets, splitting costs, or tracking business expenses; unrelated banking, lending, trading, and calculator apps are excluded. Availability can vary by region and device, and listing verification does not test app functionality. Ratings, review counts, and prices are intentionally omitted. The activity feed is a labeled simulation.

To suggest a missing app, [open an issue](https://github.com/sanyo4ever/tracker-count/issues/new) with its official store URL. Review the listing's relevance, deduplicate by Apple app ID or Android package ID, and record its source and verification date before adding it. Discovery results must be reviewed before publication.

## Repeatable discovery

These dependency-free scripts query public store search results at a modest pace and output **unreviewed candidates**. They do not update the published catalog:

```sh
node scripts/discover-ios.mjs --output ios-candidates.json
node scripts/discover-android.mjs > android-candidates.json
```

The iOS script searches six terms in US, Ukrainian, and UK storefronts. The Android script searches eight terms in the US English storefront; custom terms can be passed as quoted arguments. Candidate files are ignored by Git. Check each relevant listing and record its verification in the corresponding provenance file before adding it to `src/data/`.

## GitHub Pages

The deployment workflow builds the project and publishes `dist/` through GitHub Actions on every push to `main`. Site URL: [sanyo4ever.github.io/tracker-count](https://sanyo4ever.github.io/tracker-count/).

For a fork, enable **Settings → Pages → Build and deployment → Source → GitHub Actions**, then push to `main` or run the deployment workflow manually. Free GitHub Pages hosting requires a public repository. The workflow sets the Vite base path from the repository name; update the canonical and social-preview URLs in `index.html` if you deploy under a different owner or name.

The social preview is `public/og-image.png` (1200 × 630), with an editable, font-embedded SVG source alongside it.
