// Public Google Play search discovery only. Review and verify candidates before
// adding them to the catalog. Uses built-in Node APIs; never writes catalog data.
const queries = process.argv.slice(2);
if (!queries.length) queries.push(
  'expense tracker', 'spending tracker', 'budget planner', 'money manager',
  'receipt expenses', 'bill split', 'offline expense tracker', 'travel expenses',
);

const candidates = new Map();
const searches = [];
const decode = (value) => value
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

for (const query of queries) {
  const url = new URL('https://play.google.com/store/search');
  url.search = new URLSearchParams({ q: query, c: 'apps', hl: 'en', gl: 'US' });
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  searches.push({ query, sourceUrl: url.href, httpStatus: response.status });
  if (response.status === 403 || response.status === 429) {
    throw new Error(`Discovery stopped at HTTP ${response.status}; no retry or bypass attempted.`);
  }
  if (!response.ok) continue;
  const html = await response.text();
  for (const match of html.matchAll(/<a\b[^>]*href="(\/store\/apps\/details\?id=[^"]+)"[^>]*>(.*?)<\/a>/gs)) {
    const appUrl = new URL(decode(match[1]), 'https://play.google.com');
    const id = appUrl.searchParams.get('id');
    if (!id) continue;
    const label = decode(match[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
    const row = candidates.get(id) ?? {
      id, listingLabel: label,
      sourceUrl: `https://play.google.com/store/apps/details?id=${encodeURIComponent(id)}`,
      discoveredQueries: [],
    };
    if (!row.discoveredQueries.includes(query)) row.discoveredQueries.push(query);
    candidates.set(id, row);
  }
  await new Promise((resolve) => setTimeout(resolve, 1200));
}

console.log(JSON.stringify({
  discoveredAt: new Date().toISOString(),
  note: 'Candidates only; search results include unrelated apps and need manual review.',
  searches, candidates: [...candidates.values()],
}, null, 2));
