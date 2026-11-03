import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowDownLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Copy, Plus, ReceiptText, Search, Share2, Sparkles, X } from 'lucide-react';
import ios from './data/ios.json';
import android from './data/android.json';

type Platform = 'ios' | 'android';
type AppRecord = { id: string; name: string; platform: string; storeUrl: string; iconUrl?: string; developer?: string; tags: string[]; description: string; verifiedAt: string };
const catalog: AppRecord[] = [...ios, ...android];
const counts = { ios: ios.length, android: android.length };
const homeUrl = new URL(import.meta.env.BASE_URL, window.location.origin).href;
function suggestAppUrl(platform?: Platform, name = '') {
  const params = new URLSearchParams({
    title: `Missing app${name.trim() ? `: ${name.trim()}` : ''}`,
    body: `App name: ${name.trim()}\nPlatform: ${platform === 'ios' ? 'App Store' : platform === 'android' ? 'Google Play' : ''}\nOfficial store URL: \n\nWhat does it track?\n`,
  });
  return `https://github.com/sanyo4ever/tracker-count/issues/new?${params}`;
}
const quips = [
  'Another developer just discovered localStorage.',
  'Somewhere, someone is reinventing a pie chart.',
  'This one has AI. Obviously.',
  'Finally, an expense tracker with dark mode.',
  'Built in a weekend. Launched to 3 users. One is mom.',
  'Someone just added a subscription to their budgeting app.',
  'A new expense tracker is being written in Next.js.',
];

function StoreIcon({ platform, size = 24 }: { platform: Platform; size?: number }) {
  return platform === 'ios' ? <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.37 3.6c.87-1.02 1.46-2.44 1.3-3.6-1.26.05-2.79.84-3.69 1.86-.81.9-1.53 2.34-1.34 3.72 1.4.11 2.84-.7 3.73-1.98ZM20.3 12.84c-.04-3.06 2.5-4.54 2.61-4.61-1.43-2.09-3.64-2.37-4.43-2.41-1.89-.2-3.72 1.13-4.68 1.13-.98 0-2.46-1.11-4.06-1.08-2.08.03-4.02 1.24-5.08 3.11-2.2 3.8-.56 9.41 1.55 12.49 1.06 1.51 2.29 3.19 3.89 3.12 1.56-.06 2.15-1 4.04-1 1.87 0 2.42 1 4.05.97 1.68-.03 2.74-1.51 3.76-3.04 1.22-1.74 1.71-3.46 1.74-3.55-.04-.01-3.36-1.28-3.39-5.13Z" transform="translate(-2 -1) scale(.95)" /></svg> : <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m7 5-2-3m12 3 2-3M3 13a9 9 0 0 1 18 0v5H3v-5Z"/><circle cx="8" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="1" fill="currentColor" stroke="none"/><path d="M7 18v4m10-4v4M1 11v6m22-6v6" strokeLinecap="round"/></svg>;
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-25px' }} transition={{ duration: reduced ? 0 : .65, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function RollingNumber({ value }: { value: number }) {
  const reduced = useReducedMotion();
  return <span className="rolling-number" aria-label={String(value)}>{String(value).padStart(3, '0').split('').map((digit, index) => <span className="digit-window" aria-hidden="true" key={index}><motion.span className="digit-reel" initial={{ y: reduced ? `${-Number(digit) * 10}%` : '0%' }} animate={{ y: `${-Number(digit) * 10}%` }} transition={{ duration: reduced ? 0 : 1.6 + index * .3, delay: .35 + index * .1, ease: [.16, 1, .3, 1] }}>{Array.from({ length: 10 }, (_, n) => <span key={n}>{n}</span>)}</motion.span></span>)}</span>;
}

function Counter({ platform }: { platform: Platform }) {
  return <a href={`#/${platform}`} className={`counter counter-${platform}`} aria-label={`Browse ${counts[platform]} ${platform === 'ios' ? 'App Store' : 'Google Play'} expense trackers`}>
    <div className="counter-top"><span><StoreIcon platform={platform} />{platform === 'ios' ? 'APP STORE' : 'GOOGLE PLAY'}</span><span className="collection-number">COLLECTION {platform === 'ios' ? '01' : '02'}</span></div>
    <div className="counter-center"><RollingNumber value={counts[platform]} /><span className="counter-open"><ArrowUpRight /></span></div>
    <div className="counter-bottom"><div><span className="mono small">EXPENSE TRACKERS INDEXED SO FAR</span><p>{platform === 'ios' ? 'iOS developers have been busy.' : 'Android wasn’t going to be left behind.'}</p></div><ArrowUpRight size={19} /></div>
  </a>;
}

function LiveTicker() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => { if (reduced) return; const timer = window.setInterval(() => setIndex(i => (i + 1) % quips.length), 5200); return () => clearInterval(timer); }, [reduced]);
  return <section className="live-section" aria-label="Imaginary developer activity">
    <div className="live-label"><span className="live-dot" /> THE CYCLE CONTINUES<span className="simulated">SIMULATED, OBVIOUSLY</span></div>
    <div className="live-message"><span className="equalizer" aria-hidden="true"><i/><i/><i/><i/><i/></span><AnimatePresence mode="wait"><motion.p key={index} initial={{ opacity: 0, y: reduced ? 0 : 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -15 }} transition={{ duration: .3 }}>{quips[index]}</motion.p></AnimatePresence><button className="next-quip" aria-label="Next imaginary update" onClick={() => setIndex(i => (i + 1) % quips.length)}><ArrowRight /></button></div>
    <div className="live-footer mono"><span>NO ACTUAL DEVELOPERS WERE TRACKED.</span><span>{String(index + 1).padStart(2, '0')} / {String(quips.length).padStart(2, '0')}</span></div>
  </section>;
}

function AppIcon({ app }: { app: AppRecord }) {
  const [failed, setFailed] = useState(false);
  return app.iconUrl && !failed ? <img className="app-icon" src={app.iconUrl} alt="" loading="lazy" onError={() => setFailed(true)} /> : <span className="app-icon icon-fallback" aria-hidden="true">{app.name.slice(0, 1)}</span>;
}

function Home({ openShare, openEasterEgg }: { openShare: () => void; openEasterEgg: () => void }) {
  return <>
    <section className="hero page-width">
      <Reveal className="hero-eyebrow"><span className="eyebrow"><span className="tiny-cross">✳</span> AN ONGOING HUMAN ACHIEVEMENT</span><span className="mono museum-index">INTERNET MUSEUM № 001</span></Reveal>
      <Reveal delay={.08} className="headline-wrap"><h1>YET ANOTHER<span>EXPENSE TRACKER<span className="period">.</span></span></h1><div className="hero-sticker" aria-label="Zero original ideas, and counting"><span>100% REAL APPS</span><strong>0</strong><span>ORIGINAL IDEAS</span><Sparkles size={18}/></div></Reveal>
      <Reveal className="hero-description" delay={.16}><div className="handwritten">Because apparently,<br/>we needed one more.<ArrowDownLeft size={31} strokeWidth={1.4}/></div><p>Somewhere right now, a developer is building an expense tracker<br className="desktop-break"/> because all the other ones “weren’t quite right.”</p><a className="hero-down" href="#collection" aria-label="Explore the collection"><ArrowDown size={23}/></a></Reveal>
    </section>
    <section className="collection page-width" id="collection" aria-label="Expense tracker collections">
      <Reveal className="section-topline"><span className="eyebrow">VERIFIED APPS IN OUR INDEX.</span><span className="mono small">SOMEONE HAD TO START COUNTING. ↙</span></Reveal>
      <div className="counter-grid"><Reveal delay={.1}><Counter platform="ios"/></Reveal><Reveal delay={.2}><Counter platform="android"/></Reveal></div>
      <p className="index-coverage">A growing, incomplete catalog. These counters show the listings we’ve verified. The total across either store is unknown. <a href={suggestAppUrl()} target="_blank" rel="noopener noreferrer">Suggest a missing app ↗</a></p>
      <div className="collection-note mono"><span><span className="live-dot"/> REAL APPS. VERIFIED LINKS. QUESTIONABLE NECESSITY.</span><a href="#/about">A curated count, not the whole internet. <ArrowUpRight size={13}/></a></div>
    </section>
    <div className="marquee" aria-hidden="true"><div>{Array.from({ length: 4 }, (_, i) => <span key={i}>THE WHEEL HAS BEEN REINVENTED <span className="marquee-star">✳</span> AND IT HAS DARK MODE <span className="marquee-star">✳</span> </span>)}</div></div>
    <section className="dispatch page-width"><Reveal className="dispatch-heading"><span className="eyebrow">FROM THE DEVELOPER ECOSYSTEM</span><h2>INNOVATION<br/>NEVER SLEEPS<span className="lime-text">.</span></h2><p>Neither does the urge to build<br/>a slightly different pie chart.</p></Reveal><Reveal delay={.15}><LiveTicker/></Reveal></section>
    <section className="manifesto page-width" id="manifesto"><Reveal className="manifesto-intro"><span className="eyebrow">A BRIEF EXISTENTIAL CRISIS</span><h2>GOOD QUESTIONS.<br/><span className="serif-word">Unnecessary</span> ANSWERS.</h2></Reveal><div className="question-list">{[
      ['Did we need another one?', 'No.'], ['Will someone build one tomorrow?', 'Absolutely.'], ['Does this website solve anything?', 'Also no.'], ['But is it beautiful?', 'Unreasonably.'],
    ].map(([q, a], i) => <Reveal key={q} className="question"><span className="mono question-no">0{i + 1}</span><h3>{q}</h3><span className="question-answer">{a}</span><Plus size={20} className="question-cross"/></Reveal>)}</div></section>
    <section className="share-banner"><div className="page-width share-inner"><Reveal><span className="eyebrow">YOU KNOW EXACTLY WHO TO SEND THIS TO.</span><h2>SUPPORT YOUR LOCAL<br/>WHEEL REINVENTOR.</h2></Reveal><div className="share-actions"><button className="pill-button dark-button" onClick={openShare}>Spread the unnecessary <ArrowUpRight size={21}/></button><button className="easter-button" onClick={openEasterEgg}>Actually… I built one too.</button></div></div></section>
  </>;
}

function Directory({ platform }: { platform: Platform }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('name');
  const [tag, setTag] = useState('All exhibits');
  const [limit, setLimit] = useState(12);
  const entries = catalog.filter(app => app.platform === platform);
  const tags = ['All exhibits', 'Budgeting', 'Expenses', 'Shared expenses', 'Business'];
  const filtered = entries.filter(app => `${app.name} ${app.developer} ${app.description} ${app.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()) && (tag === 'All exhibits' || app.tags.includes(tag))).sort((a, b) => sort === 'name-desc' ? b.name.localeCompare(a.name) : sort === 'developer' ? (a.developer || '').localeCompare(b.developer || '') : a.name.localeCompare(b.name));
  return <main className={`directory page-width directory-${platform}`}>
    <a href="#/" className="back-link mono"><ArrowDownLeft size={16}/> BACK TO THE MONUMENT</a>
    <div className="directory-heading"><Reveal><span className="eyebrow">COLLECTION {platform === 'ios' ? '01 / APP STORE' : '02 / GOOGLE PLAY'}</span><h1>{platform === 'ios' ? <>THERE’S AN APP<br/>FOR THAT<span className="lime-text">.</span> AND THAT.</> : <>ANDROID HAD<br/>OPINIONS, TOO<span className="lime-text">.</span></>}</h1><p>{platform === 'ios' ? 'Every iOS expense tracker in our collection. Because one wasn’t enough.' : 'Android developers also had opinions about spreadsheets.'}</p></Reveal><span className="directory-count"><StoreIcon platform={platform} size={31}/><strong>{String(entries.length).padStart(3, '0')}</strong><span className="mono">INDEXED SO FAR</span></span></div>
    <nav className="platform-tabs" aria-label="Choose a store"><a href="#/ios" aria-current={platform === 'ios' ? 'page' : undefined}><StoreIcon platform="ios" size={20}/> App Store <span>{counts.ios}</span></a><a href="#/android" aria-current={platform === 'android' ? 'page' : undefined}><StoreIcon platform="android" size={20}/> Google Play <span>{counts.android}</span></a></nav>
    <p className="index-coverage">Search covers our {entries.length} indexed {platform === 'ios' ? 'iOS' : 'Android'} listings. Many apps are still missing. <a href={suggestAppUrl(platform, query)} target="_blank" rel="noopener noreferrer">Suggest a missing app ↗</a></p>
    <div className="search-controls"><label className="search-box"><Search size={23}/><input type="search" placeholder="Find your next financial personality…" aria-label="Search apps, developers, or features" value={query} onChange={e => { setQuery(e.target.value); setLimit(12); }}/>{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={18}/></button>}</label><label className="sort-select"><span className="mono">SORT BY</span><select value={sort} aria-label="Sort apps" onChange={e => setSort(e.target.value)}><option value="name">Name: A–Z</option><option value="name-desc">Name: Z–A</option><option value="developer">Developer</option></select><ChevronDown size={15}/></label></div>
    <div className="filter-row">{tags.map(t => <button key={t} className={tag === t ? 'active' : ''} aria-pressed={tag === t} onClick={() => { setTag(t); setLimit(12); }}>{t}</button>)}</div>
    <div className="results-heading mono small"><span aria-live="polite">{filtered.length} EXHIBITS FOUND</span><span>REAL APPS. ACTUAL STORE LINKS.</span></div>
    <div className="app-list">{filtered.slice(0, limit).map((app, index) => <a className="app-row" key={app.id} href={app.storeUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${app.name} on ${platform === 'ios' ? 'the App Store' : 'Google Play'} (opens new tab)`}><span className="app-index mono">{String(index + 1).padStart(2, '0')}</span><AppIcon app={app}/><div className="app-details"><h2>{app.name}</h2><p>{app.description}</p><span className="app-developer">{app.developer}</span></div><div className="app-tags">{app.tags.slice(0, 2).map(t => <span key={t}>{t}</span>)}</div><span className="app-external"><ArrowUpRight size={24}/></span></a>)}</div>
    {!filtered.length && <div className="empty-state"><Search size={45}/><h2>OUR INDEX HAS GAPS.</h2><p>No matches with these filters. The app may exist—we may simply have missed it.</p><button className="pill-button" onClick={() => { setQuery(''); setTag('All exhibits'); }}>Reset the search <ArrowRight size={18}/></button><a className="missing-app-link" href={suggestAppUrl(platform, query)} target="_blank" rel="noopener noreferrer">Suggest this app on GitHub <ArrowUpRight size={16}/></a></div>}
    {limit < filtered.length && <div className="load-more"><button className="pill-button" onClick={() => setLimit(n => n + 12)}>Yes, there are more <Plus size={19}/></button><span className="mono small">SHOWING {Math.min(limit, filtered.length)} OF {filtered.length}</span></div>}
    <p className="directory-footnote">Curated from official store listings. Availability varies by region and may change. No rankings, sponsorships, or made-up download counts. <a href="#/about">Our extremely serious methodology ↗</a></p>
  </main>;
}

function About() {
  const dates = Array.from(new Set(catalog.map(app => app.verifiedAt))).sort();
  return <main className="about page-width"><a href="#/" className="back-link mono"><ArrowDownLeft size={16}/> BACK TO THE MONUMENT</a><span className="eyebrow">THE SMALL PRINT, AT A REASONABLE SIZE</span><h1>THE JOKE IS FAKE.<br/>THE APPS ARE REAL<span className="lime-text">.</span></h1><div className="about-grid"><h2>A museum of<br/>reinvented wheels.</h2><div><p>Every week, the internet announces another way to track the price of a coffee. We thought someone should track the trackers. This is that monument to human persistence.</p><h3>What are we counting?</h3><p>Exactly {counts.ios} iOS listings and {counts.android} Android listings in our curated collection. These are indexed apps, not an estimate of every expense tracker in either store. An app on both platforms counts once in each collection.</p><h3>How are the listings verified?</h3><p>The iOS collection uses Apple’s public iTunes API and official App Store listings. Android entries are checked against official Google Play listing pages. Each record includes its source URL and verification date. Listing verification dates: <strong>{dates[0]}–{dates.at(-1)}</strong>. Each record keeps its own verification date.</p><p>Tags and short descriptions are editorial summaries. We include personal expense trackers, budget planners, shared-expense tools, and business receipt or expense tools. Store availability and features can change, and may vary by region.</p><h3>Is that activity feed real?</h3><p>Absolutely not. It’s a rotating set of jokes, labeled as a simulation. We do not track developers, new app releases, or anyone’s finances.</p><h3>Spotted a missing wheel?</h3><p>Store searches return a limited selection that varies with query and storefront. We combine multiple searches and check relevant listings, but cannot measure total coverage or guarantee that a specific app is included. <a href={suggestAppUrl()} target="_blank" rel="noopener noreferrer">Suggest a missing app on GitHub</a> with its official store URL so it can be reviewed. This museum is independent and is not affiliated with Apple, Google, or the listed developers. App names and icons belong to their respective owners.</p><a className="pill-button" href="#/ios">Enter the collection <ArrowUpRight size={19}/></a></div></div></main>;
}

function Dialog({ children, close, label }: { children: ReactNode; close: () => void; label: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector<HTMLButtonElement>('button')?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const items = ref.current?.querySelectorAll<HTMLElement>('button, a[href], input');
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [close]);
  return <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }} onClick={close}><motion.div ref={ref} role="dialog" aria-modal="true" aria-label={label} className="dialog" initial={{ y: reduced ? 0 : 30, rotate: reduced ? 0 : -2 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: reduced ? 0 : .25 }} onClick={e => e.stopPropagation()}><button className="dialog-close" aria-label="Close dialog" onClick={close}><X/></button>{children}</motion.div></motion.div>;
}

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1).split('?')[0] || '/');
  const [dialog, setDialog] = useState<'share' | 'easter' | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const update = () => { const next = window.location.hash.slice(1).split('?')[0] || '/'; if (next.startsWith('/')) { setRoute(next); window.scrollTo(0, 0); } };
    window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update);
  }, []);
  useEffect(() => { document.title = route === '/ios' ? 'App Store Collection — Yet Another Expense Tracker' : route === '/android' ? 'Google Play Collection — Yet Another Expense Tracker' : 'Yet Another Expense Tracker — A Museum of Reinvented Wheels'; }, [route]);
  async function copyLink() { try { await navigator.clipboard.writeText(homeUrl); setCopied(true); setCopyFailed(false); } catch { setCopyFailed(true); } }
  const closeDialog = useRef(() => { setDialog(null); setCopied(false); setCopyFailed(false); }).current;
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header page-width"><a href="#/" className="brand" aria-label="Yet Another Expense Tracker home"><span className="brand-icon"><ReceiptText size={23} strokeWidth={1.7}/></span><span>yet another<span>expense tracker.</span></span></a><nav className="main-nav" aria-label="Main navigation"><a href="#/about">The absurdity</a><a href="#/ios">Explore the collection <ArrowUpRight size={15}/></a></nav><button className="header-share" onClick={() => setDialog('share')}>Pass it on <Share2 size={15}/></button></header>
    <div id="main"><AnimatePresence mode="wait"><motion.div key={route} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>{route === '/ios' || route === '/android' ? <Directory key={route} platform={route.slice(1) as Platform}/> : route === '/about' ? <About/> : <main><Home openShare={() => setDialog('share')} openEasterEgg={() => setDialog('easter')}/></main>}</motion.div></AnimatePresence></div>
    <footer className="site-footer page-width"><a href="#/" className="footer-logo"><ReceiptText size={21}/> YAET<span>© {new Date().getFullYear()}</span></a><p>This website is technically yet another tracker.</p><a href="#/about">A very unnecessary project <ArrowUpRight size={14}/></a></footer>
    <AnimatePresence mode="wait">{dialog === 'share' && <Dialog key="share" close={closeDialog} label="Share the museum"><span className="eyebrow">SEND HELP. OR SEND THIS LINK.</span><h2>MAKE SOMEONE’S<br/>NEXT BUILD AWKWARD.</h2><p>“Bro, somebody actually built a tracker for expense trackers.”</p><a className="pill-button dark-button" href={`https://www.threads.net/intent/post?text=${encodeURIComponent(`Somebody actually built a tracker for expense trackers. Humanity has peaked.\n\n${homeUrl}`)}`} target="_blank" rel="noopener noreferrer">Share on Threads <ArrowUpRight size={20}/></a><button className="pill-button" onClick={copyLink}>{copied ? 'Copied. Go cause a little chaos.' : 'Copy this unnecessary link'}{copied ? <Check size={20}/> : <Copy size={19}/>}</button>{copyFailed && <label className="copy-fallback">Copy the link below:<input readOnly value={homeUrl} onFocus={e => e.target.select()}/></label>}<span className="mono small">THE INTERNET DIDN’T ASK. TELL IT ANYWAY.</span></Dialog>}{dialog === 'easter' && <Dialog key="easter" close={closeDialog} label="Certificate of wheel reinvention"><span className="eyebrow">OFFICIAL CERTIFICATE OF PARTICIPATION</span><div className="certificate-seal"><ReceiptText size={47}/></div><h2>OF COURSE<br/>YOU DID.</h2><p>We’re sure yours is different.<br/>Does it have a pie chart?</p><div className="certificate-note mono">CERTIFIED WHEEL REINVENTOR<br/>EST. APPROXIMATELY EVERY WEEKEND</div><button className="pill-button dark-button" onClick={() => setDialog('share')}>I deserve to be celebrated <ArrowUpRight size={20}/></button></Dialog>}</AnimatePresence>
  </>;
}
