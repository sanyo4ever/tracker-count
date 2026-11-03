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

## Ukrainian coverage

The **Ukrainian-made** filter requires evidence of a Ukrainian developer or team connection, such as an official developer-country disclosure, a creator statement, or a documented Ukrainian product listing. Ukrainian language support, Ukrainian storefront availability, and a developer's name alone are insufficient. Each tagged record has a `ukrainianOrigin` evidence object in its platform's provenance file; personal street addresses are not copied.

`src/data/ukrainian-audit.json` records the targeted search scope, sources, and candidate dispositions, including web-only, prerelease, and unresolved cases. The audit is not an exhaustive registry of every Ukrainian developer. Optional `aliases` make official Ukrainian titles and documented former names searchable; renamed apps keep one store ID and do not inflate the counters.

## Repeatable discovery

These dependency-free scripts query public store search results at a modest pace and output **unreviewed candidates**. They do not update the published catalog:

```sh
node scripts/discover-ios.mjs --output ios-candidates.json
node scripts/discover-android.mjs > android-candidates.json
```

The iOS script runs broad searches in US, Ukrainian, and UK storefronts, plus five Ukrainian-language searches in Ukraine and named-app checks. The Android script searches eight terms in the US English storefront; custom terms can be passed as quoted arguments. Candidate files are ignored by Git. Check each relevant listing and record its verification in the corresponding provenance file before adding it to `src/data/`.

## Sponsored homepage placement

The homepage labels Lichy's ₴100 placement as an advertisement. Its icon and App Store link come from the verified catalog record. The donation-ranking line is the promotional premise; there is no payment processing or automatic bidding system. Directory sorting and indexed counts still derive from the catalog, independently of this placement.

## Languages

The header switches between Ukrainian and English without clearing the open collection, search, or filters. Initial language priority is `?lang=uk` / `?lang=en`, a saved browser preference, then the first supported browser language (English fallback). The choice persists when browser storage is available; share links carry the selected language.

UI copy, accessibility labels, page titles, jokes, sponsorship disclosure, categories, and catalog descriptions are localized. Original product and developer names stay unchanged. Ukrainian descriptions live in `src/data/ios-uk.json` and `src/data/android-uk.json`, keyed by exact catalog IDs; include a translation when adding a listing. Search matches both languages and documented aliases. Ukrainian typography uses locally bundled Roboto and Roboto Condensed fonts.

## GitHub Pages

The deployment gets its public URL and asset base path from GitHub Pages, so it works at either a project subpath or a custom domain root.

To enable GA4, set the repository Actions variable `GA_MEASUREMENT_ID` to the project's web stream ID (`G-…`), then run the Pages workflow. Leave automatic page views based on browser history disabled in the stream's Enhanced Measurement settings: the site already sends one page view per hash route. Without the variable, no Analytics script loads.

The deployment workflow builds the project and publishes `dist/` through GitHub Actions on every push to `main`. Site URL: [sanyo4ever.github.io/tracker-count](https://sanyo4ever.github.io/tracker-count/).

For a fork, enable **Settings → Pages → Build and deployment → Source → GitHub Actions**, then push to `main` or run the deployment workflow manually. Free GitHub Pages hosting requires a public repository. The workflow sets the Vite base path from the repository name; update the canonical and social-preview URLs in `index.html` if you deploy under a different owner or name.

The social preview is `public/og-image.png` (1200 × 630), with an editable, font-embedded SVG source alongside it.
