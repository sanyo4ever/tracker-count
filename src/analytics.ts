const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
let previousLocation: string | undefined;

export function trackPage(route: string) {
  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return;

  const url = new URL(window.location.href);
  url.hash = route === '/' ? '' : route;
  // Keep campaign attribution without sending arbitrary query strings.
  for (const key of Array.from(url.searchParams.keys())) {
    if (!['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content'].includes(key)) {
      url.searchParams.delete(key);
    }
  }
  if (url.href === previousLocation) return;

  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer ??= [];
  function gtag(..._args: unknown[]) {
    w.dataLayer!.push(arguments);
  }
  if (!previousLocation) {
    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
  }
  gtag('event', 'page_view', {
    send_to: measurementId,
    page_location: url.href,
    page_title: document.title,
    page_referrer: previousLocation || document.referrer,
  });
  previousLocation = url.href;
}
