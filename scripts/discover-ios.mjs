// Discovery only: writes candidates for review, never edits the published catalog.
// Usage: node scripts/discover-ios.mjs --output C:/temp/ios-candidates.json
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { setTimeout as pause } from 'node:timers/promises';

const outputIndex = process.argv.indexOf('--output');
const output = outputIndex === -1 ? null : process.argv[outputIndex + 1];
if (outputIndex !== -1 && !output) throw new Error('--output requires a file path');
if (output && /(?:^|[\\/])src[\\/]data[\\/]/i.test(resolve(output))) {
  throw new Error('Discovery output must not overwrite published src/data files');
}

const terms = ['expense tracker', 'spending tracker', 'budget planner', 'money manager', 'receipt expenses', 'bill split'];
const countries = ['us', 'ua', 'gb'];
const queries = countries.flatMap(country => terms.map(term => ({ country, term, limit: '200' })));
// Native-language discovery complements English rankings; language is not origin evidence.
for (const term of ['облік витрат', 'сімейний бюджет', 'фінанси', 'бюджет', 'витрати']) {
  queries.push({ country: 'ua', term, limit: '200' });
}
// Named checks complement ranked broad searches; this remains an incomplete index.
for (const term of ['MoneyWiz', "Today's Budget", 'Lunch Money']) {
  queries.push({ country: 'us', term, limit: '5' });
}
const candidates = new Map();
const searches = [];
let requestCount = 0;

for (const { country, term, limit } of queries) {
    if (requestCount++) await pause(3250);
    const url = new URL('https://itunes.apple.com/search');
    url.search = new URLSearchParams({ term, country, entity: 'software', limit });
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    // Stop on errors, rate limits, or challenges. Do not bypass access controls.
    if (!response.ok) throw new Error(`Apple returned HTTP ${response.status} for ${country}: ${term}`);
    const payload = await response.json();
    const fetchedAt = new Date().toISOString();
    searches.push({ term, country, url: url.href, fetchedAt, resultCount: payload.resultCount });
    for (const app of payload.results) {
      if (app.wrapperType !== 'software') continue;
      const id = String(app.trackId);
      if (!candidates.has(id)) {
        candidates.set(id, {
          trackId: id,
          name: app.trackName,
          developer: app.artistName,
          storeUrl: app.trackViewUrl,
          iconUrl: app.artworkUrl512 || app.artworkUrl100,
          description: app.description,
          primaryGenre: app.primaryGenreName,
          bundleId: app.bundleId,
          supportsIPhone: (app.supportedDevices || []).some(device => device.startsWith('iPhone')),
          metadataStorefront: country,
          fetchedAt,
          discoveredBy: [],
        });
      }
      candidates.get(id).discoveredBy.push({ country, term });
    }
    console.error(`${country}: ${term}: ${payload.resultCount} results; ${candidates.size} unique candidates`);
}

const result = {
  source: 'Apple public iTunes Search API',
  purpose: 'Unreviewed discovery candidates. Results include unrelated apps and are not a store-wide count.',
  searches,
  candidates: [...candidates.values()],
};
const json = JSON.stringify(result, null, 2) + '\n';
if (output) {
  await writeFile(resolve(output), json, 'utf8');
  console.error(`Wrote ${candidates.size} candidates to ${resolve(output)}. Review before publication.`);
} else {
  process.stdout.write(json);
}
