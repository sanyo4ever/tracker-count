import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowDownLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Copy, Plus, ReceiptText, Search, Share2, Sparkles, X } from 'lucide-react';
import ios from './data/ios.json';
import android from './data/android.json';
import SponsorSpot from './SponsorSpot';
import { trackPage } from './analytics';
import AboutPage from './About';
import { appDescription, tagLabel, useLocale, type Locale } from './i18n';

type Platform = 'ios' | 'android';
type AppRecord = { id: string; name: string; platform: string; storeUrl: string; iconUrl?: string; developer?: string; tags: string[]; aliases?: string[]; description: string; verifiedAt: string };
const catalog: AppRecord[] = [...ios, ...android];
const counts = { ios: ios.length, android: android.length };
const lichy = ios.find(app => app.id === 'ios-6773329338');
const homeUrl = new URL(import.meta.env.BASE_URL, window.location.origin).href;
const ukrainianAuditUrl = 'https://github.com/sanyo4ever/tracker-count/blob/main/src/data/ukrainian-audit.json';
function visibleTags(app: AppRecord) {
  return app.tags.includes('Ukrainian-made')
    ? ['Ukrainian-made', ...app.tags.filter(tag => tag !== 'Ukrainian-made')].slice(0, 2)
    : app.tags.slice(0, 2);
}
function suggestAppUrl(platform?: Platform, name = '', locale: Locale = 'en') {
  const params = new URLSearchParams({
    title: `${locale === 'uk' ? 'Відсутній застосунок' : 'Missing app'}${name.trim() ? `: ${name.trim()}` : ''}`,
    body: locale === 'uk' ? `Назва застосунку: ${name.trim()}\nПлатформа: ${platform === 'ios' ? 'App Store' : platform === 'android' ? 'Google Play' : ''}\nОфіційне посилання в магазині: \n\nЩо він відстежує?\n` : `App name: ${name.trim()}\nPlatform: ${platform === 'ios' ? 'App Store' : platform === 'android' ? 'Google Play' : ''}\nOfficial store URL: \n\nWhat does it track?\n`,
  });
  return `https://github.com/sanyo4ever/tracker-count/issues/new?${params}`;
}
const quips = [
  ['Another developer just discovered localStorage.', 'Ще один розробник щойно відкрив для себе localStorage.'],
  ['Somewhere, someone is reinventing a pie chart.', 'Десь хтось знову винаходить кругову діаграму.'],
  ['This one has AI. Obviously.', 'У цього є ШІ. Ну а як інакше.'],
  ['Finally, an expense tracker with dark mode.', 'Нарешті трекер витрат із темною темою.'],
  ['Built in a weekend. Launched to 3 users. One is mom.', 'Зроблено за вихідні. Уже 3 користувачі. Один із них — мама.'],
  ['Someone just added a subscription to their budgeting app.', 'Хтось щойно додав підписку в застосунок для економії грошей.'],
  ['A new expense tracker is being written in Next.js.', 'На Next.js просто зараз пишуть новий трекер витрат.'],
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
  const { t } = useLocale();
  return <a href={`#/${platform}`} className={`counter counter-${platform}`} aria-label={t(`Browse ${counts[platform]} ${platform === 'ios' ? 'App Store' : 'Google Play'} expense trackers`, `Переглянути трекери витрат у ${platform === 'ios' ? 'App Store' : 'Google Play'}: ${counts[platform]}`)}>
    <div className="counter-top"><span><StoreIcon platform={platform} />{platform === 'ios' ? 'APP STORE' : 'GOOGLE PLAY'}</span><span className="collection-number">{t('COLLECTION', 'КОЛЕКЦІЯ')} {platform === 'ios' ? '01' : '02'}</span></div>
    <div className="counter-center"><RollingNumber value={counts[platform]} /><span className="counter-open"><ArrowUpRight /></span></div>
    <div className="counter-bottom"><div><span className="mono small">{t('EXPENSE TRACKERS INDEXED SO FAR', 'ТРЕКЕРІВ ВИТРАТ У КАТАЛОЗІ')}</span><p>{platform === 'ios' ? t('iOS developers have been busy.', 'Розробники iOS не байдикували.') : t('Android wasn’t going to be left behind.', 'Android теж не пас задніх.')}</p></div><ArrowUpRight size={19} /></div>
  </a>;
}

function LiveTicker() {
  const { t } = useLocale();
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => { if (reduced) return; const timer = window.setInterval(() => setIndex(i => (i + 1) % quips.length), 5200); return () => clearInterval(timer); }, [reduced]);
  return <section className="live-section" aria-label={t('Imaginary developer activity', 'Вигадана активність розробників')}>
    <div className="live-label"><span className="live-dot" /> {t('THE CYCLE CONTINUES', 'ЦИКЛ ТРИВАЄ')}<span className="simulated">{t('SIMULATED, OBVIOUSLY', 'ЦЕ СИМУЛЯЦІЯ. АВЖЕЖ.')}</span></div>
    <div className="live-message"><span className="equalizer" aria-hidden="true"><i/><i/><i/><i/><i/></span><AnimatePresence mode="wait"><motion.p key={index} initial={{ opacity: 0, y: reduced ? 0 : 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -15 }} transition={{ duration: .3 }}>{t(quips[index][0], quips[index][1])}</motion.p></AnimatePresence><button className="next-quip" aria-label={t('Next imaginary update', 'Наступне вигадане оновлення')} onClick={() => setIndex(i => (i + 1) % quips.length)}><ArrowRight /></button></div>
    <div className="live-footer mono"><span>{t('NO ACTUAL DEVELOPERS WERE TRACKED.', 'ЗА ЖОДНИМ РОЗРОБНИКОМ НЕ СТЕЖИЛИ.')}</span><span>{String(index + 1).padStart(2, '0')} / {String(quips.length).padStart(2, '0')}</span></div>
  </section>;
}

function AppIcon({ app }: { app: AppRecord }) {
  const [failed, setFailed] = useState(false);
  return app.iconUrl && !failed ? <img className="app-icon" src={app.iconUrl} alt="" loading="lazy" onError={() => setFailed(true)} /> : <span className="app-icon icon-fallback" aria-hidden="true">{app.name.slice(0, 1)}</span>;
}

function Home({ openShare, openEasterEgg }: { openShare: () => void; openEasterEgg: () => void }) {
  const { locale, t } = useLocale();
  return <>
    <section className="hero page-width">
      <Reveal className="hero-eyebrow"><span className="eyebrow"><span className="tiny-cross">✳</span> {t('AN ONGOING HUMAN ACHIEVEMENT', 'ЛЮДСТВО НЕ ЗУПИНИТИ')}</span><span className="mono museum-index">{t('INTERNET MUSEUM № 001', 'ІНТЕРНЕТ-МУЗЕЙ № 001')}</span></Reveal>
      <Reveal delay={.08} className="headline-wrap"><h1>{t('YET ANOTHER', 'ЩЕ ОДИН')}<span>{t('EXPENSE TRACKER', 'ТРЕКЕР ВИТРАТ')}<span className="period">.</span></span></h1><div className="hero-sticker" aria-label={t('Zero original ideas, and counting', 'Нуль оригінальних ідей. Поки що.')}><span>{t('100% REAL APPS', '100% РЕАЛЬНІ')}</span><strong>0</strong><span>{t('ORIGINAL IDEAS', 'ОРИГІНАЛЬНИХ ІДЕЙ')}</span><Sparkles size={18}/></div></Reveal>
      <Reveal className="hero-description" delay={.16}><div className="handwritten">{t('Because apparently,', 'Бо нам, виявляється,')}<br/>{t('we needed one more.', 'бракувало ще одного.')}<ArrowDownLeft size={31} strokeWidth={1.4}/></div><p>{t('Somewhere right now, a developer is building an expense tracker', 'Десь просто зараз розробник створює трекер витрат,')}<br className="desktop-break"/>{t(' because all the other ones “weren’t quite right.”', ' бо всі інші «якось не те».')}</p><a className="hero-down" href="#collection" aria-label={t('Explore the collection', 'Переглянути колекцію')}><ArrowDown size={23}/></a></Reveal>
    </section>
    {lichy && <SponsorSpot app={lichy} />}
    <section className="collection page-width" id="collection" aria-label={t('Expense tracker collections', 'Колекції трекерів витрат')}>
      <Reveal className="section-topline"><span className="eyebrow">{t('VERIFIED APPS IN OUR INDEX.', 'ПЕРЕВІРЕНІ ЗАСТОСУНКИ В КАТАЛОЗІ.')}</span><span className="mono small">{t('SOMEONE HAD TO START COUNTING. ↙', 'ХТОСЬ МАВ ПОЧАТИ РАХУВАТИ. ↙')}</span></Reveal>
      <div className="counter-grid"><Reveal delay={.1}><Counter platform="ios"/></Reveal><Reveal delay={.2}><Counter platform="android"/></Reveal></div>
      <p className="index-coverage">{t('A growing, incomplete catalog. These counters show the listings we’ve verified. The total across either store is unknown.', 'Каталог росте, але ще неповний. Лічильники показують перевірені нами записи. Загальна кількість у магазинах невідома.')} <a href={suggestAppUrl(undefined, '', locale)} target="_blank" rel="noopener noreferrer">{t('Suggest a missing app ↗', 'Запропонувати застосунок ↗')}</a></p>
      <div className="collection-note mono"><span><span className="live-dot"/> {t('REAL APPS. VERIFIED LINKS. QUESTIONABLE NECESSITY.', 'РЕАЛЬНІ ЗАСТОСУНКИ. ПЕРЕВІРЕНІ ПОСИЛАННЯ. СУМНІВНА ПОТРЕБА.')}</span><a href="#/about">{t('A curated count, not the whole internet.', 'Порахували знайдене. Не весь інтернет.')} <ArrowUpRight size={13}/></a></div>
    </section>
    <div className="marquee" aria-hidden="true"><div>{Array.from({ length: 4 }, (_, i) => <span key={i}>{t('THE WHEEL HAS BEEN REINVENTED', 'ВЕЛОСИПЕД ЗНОВУ ВИНАЙДЕНО')} <span className="marquee-star">✳</span> {t('AND IT HAS DARK MODE', 'І В НЬОГО Є ТЕМНА ТЕМА')} <span className="marquee-star">✳</span> </span>)}</div></div>
    <section className="dispatch page-width"><Reveal className="dispatch-heading"><span className="eyebrow">{t('FROM THE DEVELOPER ECOSYSTEM', 'ЗІ СВІТУ РОЗРОБНИКІВ')}</span><h2>{t('INNOVATION', 'ІННОВАЦІЇ')}<br/>{t('NEVER SLEEPS', 'НЕ СПЛЯТЬ')}<span className="lime-text">.</span></h2><p>{t('Neither does the urge to build', 'Як і бажання зробити')}<br/>{t('a slightly different pie chart.', 'трохи іншу кругову діаграму.')}</p></Reveal><Reveal delay={.15}><LiveTicker/></Reveal></section>
    <section className="manifesto page-width" id="manifesto"><Reveal className="manifesto-intro"><span className="eyebrow">{t('A BRIEF EXISTENTIAL CRISIS', 'КОРОТКА ЕКЗИСТЕНЦІЙНА КРИЗА')}</span><h2>{t('GOOD QUESTIONS.', 'СЛУШНІ ПИТАННЯ.')}<br/><span className="serif-word">{t('Unnecessary', 'Зайві')}</span> {t('ANSWERS.', 'ВІДПОВІДІ.')}</h2></Reveal><div className="question-list">{[
      [t('Did we need another one?', 'Нам був потрібен ще один?'), t('No.', 'Ні.')], [t('Will someone build one tomorrow?', 'Завтра хтось зробить новий?'), t('Absolutely.', 'Безумовно.')], [t('Does this website solve anything?', 'Цей сайт щось вирішує?'), t('Also no.', 'Теж ні.')], [t('But is it beautiful?', 'Але ж він гарний?'), t('Unreasonably.', 'Аж занадто.')],
    ].map(([q, a], i) => <Reveal key={q} className="question"><span className="mono question-no">0{i + 1}</span><h3>{q}</h3><span className="question-answer">{a}</span><Plus size={20} className="question-cross"/></Reveal>)}</div></section>
    <section className="share-banner"><div className="page-width share-inner"><Reveal><span className="eyebrow">{t('YOU KNOW EXACTLY WHO TO SEND THIS TO.', 'ТИ ТОЧНО ЗНАЄШ, КОМУ ЦЕ СКИНУТИ.')}</span><h2>{t('SUPPORT YOUR LOCAL', 'ПІДТРИМАЙ СВОГО')}<br/>{t('WHEEL REINVENTOR.', 'ВИНАХІДНИКА ВЕЛОСИПЕДА.')}</h2></Reveal><div className="share-actions"><button className="pill-button dark-button" onClick={openShare}>{t('Spread the unnecessary', 'Поширюй непотрібне')} <ArrowUpRight size={21}/></button><button className="easter-button" onClick={openEasterEgg}>{t('Actually… I built one too.', 'Взагалі-то… я теж такий зробив.')}</button></div></div></section>
  </>;
}

function Directory({ platform }: { platform: Platform }) {
  const { locale, t } = useLocale();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('name');
  const [tag, setTag] = useState('All exhibits');
  const [limit, setLimit] = useState(12);
  const entries = catalog.filter(app => app.platform === platform);
  const tags = ['All exhibits', 'Ukrainian-made', 'Budgeting', 'Expenses', 'Shared expenses', 'Business'];
  const ukrainianCount = entries.filter(app => app.tags.includes('Ukrainian-made')).length;
  const filtered = entries.filter(app => `${app.name} ${app.developer} ${app.description} ${appDescription(app, 'uk')} ${app.tags.join(' ')} ${app.tags.map(value => tagLabel(value, 'uk')).join(' ')} ${(app.aliases || []).join(' ')}`.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale)) && (tag === 'All exhibits' || app.tags.includes(tag))).sort((a, b) => sort === 'name-desc' ? b.name.localeCompare(a.name, locale) : sort === 'developer' ? (a.developer || '').localeCompare(b.developer || '', locale) : a.name.localeCompare(b.name, locale));
  return <main className={`directory page-width directory-${platform}`}>
    <a href="#/" className="back-link mono"><ArrowDownLeft size={16}/> {t('BACK TO THE MONUMENT', 'НАЗАД ДО МОНУМЕНТА')}</a>
    <div className="directory-heading"><Reveal><span className="eyebrow">{t('COLLECTION', 'КОЛЕКЦІЯ')} {platform === 'ios' ? '01 / APP STORE' : '02 / GOOGLE PLAY'}</span><h1>{platform === 'ios' ? <>{t('THERE’S AN APP', 'НА ЦЕ Є ЗАСТОСУНОК.')}<br/>{t('FOR THAT', 'І НА ЦЕ ТЕЖ')}<span className="lime-text">.</span>{t(' AND THAT.', '')}</> : <>{t('ANDROID HAD', 'ANDROID ТЕЖ')}<br/>{t('OPINIONS, TOO', 'МАВ ЩО СКАЗАТИ')}<span className="lime-text">.</span></>}</h1><p>{platform === 'ios' ? t('Every iOS expense tracker in our collection. Because one wasn’t enough.', 'Усі трекери витрат для iOS у нашій колекції. Бо одного було замало.') : t('Android developers also had opinions about spreadsheets.', 'У розробників Android теж були претензії до таблиць.')}</p></Reveal><span className="directory-count"><StoreIcon platform={platform} size={31}/><strong>{String(entries.length).padStart(3, '0')}</strong><span className="mono">{t('INDEXED SO FAR', 'У КАТАЛОЗІ')}</span></span></div>
    <nav className="platform-tabs" aria-label={t('Choose a store', 'Вибрати магазин')}><a href="#/ios" aria-current={platform === 'ios' ? 'page' : undefined}><StoreIcon platform="ios" size={20}/> App Store <span>{counts.ios}</span></a><a href="#/android" aria-current={platform === 'android' ? 'page' : undefined}><StoreIcon platform="android" size={20}/> Google Play <span>{counts.android}</span></a></nav>
    <p className="index-coverage">{t(`Search covers our ${entries.length} indexed ${platform === 'ios' ? 'iOS' : 'Android'} listings. Many apps are still missing.`, `Пошук охоплює записи для ${platform === 'ios' ? 'iOS' : 'Android'} у нашому каталозі: ${entries.length}. Багатьох застосунків тут ще немає.`)} <a href={suggestAppUrl(platform, query, locale)} target="_blank" rel="noopener noreferrer">{t('Suggest a missing app ↗', 'Запропонувати застосунок ↗')}</a></p>
    <div className="search-controls"><label className="search-box"><Search size={23}/><input type="search" placeholder={t('Find your next financial personality…', 'Знайди своє наступне фінансове «я»…')} aria-label={t('Search apps, developers, or features', 'Пошук застосунків, розробників або функцій')} value={query} onChange={e => { setQuery(e.target.value); setLimit(12); }}/>{query && <button onClick={() => setQuery('')} aria-label={t('Clear search', 'Очистити пошук')}><X size={18}/></button>}</label><label className="sort-select"><span className="mono">{t('SORT BY', 'СОРТУВАТИ')}</span><select value={sort} aria-label={t('Sort apps', 'Сортування застосунків')} onChange={e => setSort(e.target.value)}><option value="name">{t('Name: A–Z', 'Назва: А–Я')}</option><option value="name-desc">{t('Name: Z–A', 'Назва: Я–А')}</option><option value="developer">{t('Developer', 'Розробник')}</option></select><ChevronDown size={15}/></label></div>
    <div className="filter-row">{tags.map(value => <button key={value} className={tag === value ? 'active' : ''} aria-pressed={tag === value} onClick={() => { setTag(value); setLimit(12); }}>{tagLabel(value, locale)}{value === 'Ukrainian-made' && <span className="filter-count">{ukrainianCount}</span>}</button>)}</div>
    {tag === 'Ukrainian-made' && <p className="index-coverage">{t('Sources document these developers’ or teams’ Ukrainian connection. This is an evidence-backed selection; language support alone does not qualify an app.', 'Зв’язок цих розробників або команд з Україною підтверджено джерелами. Самої підтримки української мови для цієї позначки недостатньо.')} <a href={ukrainianAuditUrl} target="_blank" rel="noopener noreferrer">{t('See the coverage audit ↗', 'Переглянути перевірку охоплення ↗')}</a></p>}
    <div className="results-heading mono small"><span aria-live="polite">{t(`${filtered.length} EXHIBITS FOUND`, `ЗНАЙДЕНО ЕКСПОНАТІВ: ${filtered.length}`)}</span><span>{t('REAL APPS. ACTUAL STORE LINKS.', 'РЕАЛЬНІ ЗАСТОСУНКИ. СПРАВЖНІ ПОСИЛАННЯ.')}</span></div>
    <div className="app-list">{filtered.slice(0, limit).map((app, index) => <a className="app-row" key={app.id} href={app.storeUrl} target="_blank" rel="noopener noreferrer" aria-label={t(`View ${app.name} on ${platform === 'ios' ? 'the App Store' : 'Google Play'} (opens new tab)`, `Переглянути ${app.name} у ${platform === 'ios' ? 'App Store' : 'Google Play'} (нова вкладка)`)}><span className="app-index mono">{String(index + 1).padStart(2, '0')}</span><AppIcon app={app}/><div className="app-details"><h2>{app.name}</h2><p>{appDescription(app, locale)}</p><span className="app-developer">{app.developer}</span></div><div className="app-tags">{visibleTags(app).map(value => <span className={value === 'Ukrainian-made' ? 'ukrainian-tag' : undefined} key={value}>{tagLabel(value, locale)}</span>)}</div><span className="app-external"><ArrowUpRight size={24}/></span></a>)}</div>
    {!filtered.length && <div className="empty-state"><Search size={45}/><h2>{t('OUR INDEX HAS GAPS.', 'У КАТАЛОЗІ Є ПРОГАЛИНИ.')}</h2><p>{t('No matches with these filters. The app may exist—we may simply have missed it.', 'За цими фільтрами нічого не знайдено. Застосунок може існувати — ми могли його пропустити.')}</p><button className="pill-button" onClick={() => { setQuery(''); setTag('All exhibits'); }}>{t('Reset the search', 'Скинути пошук')} <ArrowRight size={18}/></button><a className="missing-app-link" href={suggestAppUrl(platform, query, locale)} target="_blank" rel="noopener noreferrer">{t('Suggest this app on GitHub', 'Запропонувати цей застосунок на GitHub')} <ArrowUpRight size={16}/></a></div>}
    {limit < filtered.length && <div className="load-more"><button className="pill-button" onClick={() => setLimit(n => n + 12)}>{t('Yes, there are more', 'Так, тут є ще')} <Plus size={19}/></button><span className="mono small">{t(`SHOWING ${Math.min(limit, filtered.length)} OF ${filtered.length}`, `ПОКАЗАНО ${Math.min(limit, filtered.length)} ІЗ ${filtered.length}`)}</span></div>}
    <p className="directory-footnote">{t('Curated from official store listings. Availability varies by region and may change. Paid homepage spots are labeled as ads; collection sorting follows your selection.', 'Зібрано з офіційних сторінок у магазинах. Доступність залежить від регіону й може змінюватися. Платні місця на головній позначені як реклама; сортування колекції обираєш ти.')} <a href="#/about">{t('Our extremely serious methodology ↗', 'Наша надзвичайно серйозна методологія ↗')}</a></p>
  </main>;
}

function About() {
  const { locale } = useLocale();
  const dates = Array.from(new Set(catalog.map(app => app.verifiedAt))).sort();
  return <AboutPage counts={counts} dates={dates} ukrainianAuditUrl={ukrainianAuditUrl} suggestUrl={suggestAppUrl(undefined, '', locale)} />;
}

function Dialog({ children, close, label }: { children: ReactNode; close: () => void; label: string }) {
  const { t } = useLocale();
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
  return <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }} onClick={close}><motion.div ref={ref} role="dialog" aria-modal="true" aria-label={label} className="dialog" initial={{ y: reduced ? 0 : 30, rotate: reduced ? 0 : -2 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: reduced ? 0 : .25 }} onClick={e => e.stopPropagation()}><button className="dialog-close" aria-label={t('Close dialog', 'Закрити вікно')} onClick={close}><X/></button>{children}</motion.div></motion.div>;
}

export default function App() {
  const { locale, setLocale, t } = useLocale();
  const [route, setRoute] = useState(() => window.location.hash.slice(1).split('?')[0] || '/');
  const [dialog, setDialog] = useState<'share' | 'easter' | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const update = () => { const next = window.location.hash.slice(1).split('?')[0] || '/'; if (next.startsWith('/')) { setRoute(next); window.scrollTo(0, 0); } };
    window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    const name = locale === 'uk' ? 'Ще один трекер витрат' : 'Yet Another Expense Tracker';
    document.title = route === '/ios' ? `${locale === 'uk' ? 'Колекція App Store' : 'App Store Collection'} — ${name}` : route === '/android' ? `${locale === 'uk' ? 'Колекція Google Play' : 'Google Play Collection'} — ${name}` : `${name} — ${locale === 'uk' ? 'Музей винайдених велосипедів' : 'A Museum of Reinvented Wheels'}`;
    const description = locale === 'uk' ? 'Хтось створив трекер трекерів витрат. Реальні застосунки в найбільш непотрібному музеї інтернету. Бо нам бракувало ще одного.' : "Someone built a tracker for expense trackers. Explore the entirely real collection at the internet's most unnecessary museum. Because apparently, we needed one more.";
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    trackPage(route);
  }, [route, locale]);
  const shareUrl = `${homeUrl}?lang=${locale}`;
  async function copyLink() { try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setCopyFailed(false); } catch { setCopyFailed(true); } }
  const closeDialog = useRef(() => { setDialog(null); setCopied(false); setCopyFailed(false); }).current;
  return <>
    <a href="#main" className="skip-link">{t('Skip to content', 'Перейти до вмісту')}</a>
    <header className="site-header page-width"><a href="#/" className="brand" aria-label={t('Yet Another Expense Tracker home', 'Ще один трекер витрат — головна')}><span className="brand-icon"><ReceiptText size={23} strokeWidth={1.7}/></span><span>{t('yet another', 'ще один')}<span>{t('expense tracker.', 'трекер витрат.')}</span></span></a><nav className="main-nav" aria-label={t('Main navigation', 'Головна навігація')}><a href="#/about">{t('The absurdity', 'Про цей абсурд')}</a><a href="#/ios">{t('Explore the collection', 'До колекції')} <ArrowUpRight size={15}/></a></nav><div className="language-switch" role="group" aria-label={t('Website language', 'Мова сайту')}><button lang="uk" className={locale === 'uk' ? 'active' : ''} aria-pressed={locale === 'uk'} aria-label="Українська" onClick={() => setLocale('uk')}>UA</button><button lang="en" className={locale === 'en' ? 'active' : ''} aria-pressed={locale === 'en'} aria-label="English" onClick={() => setLocale('en')}>EN</button></div><button className="header-share" aria-label={t('Pass it on', 'Поділитися')} onClick={() => setDialog('share')}>{t('Pass it on', 'Поділитися')} <Share2 size={15}/></button></header>
    <div id="main"><AnimatePresence mode="wait"><motion.div key={route} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>{route === '/ios' || route === '/android' ? <Directory key={route} platform={route.slice(1) as Platform}/> : route === '/about' ? <About/> : <main><Home openShare={() => setDialog('share')} openEasterEgg={() => setDialog('easter')}/></main>}</motion.div></AnimatePresence></div>
    <footer className="site-footer page-width"><a href="#/" className="footer-logo"><ReceiptText size={21}/> YAET<span>© {new Date().getFullYear()}</span></a><p>{t('This website is technically yet another tracker.', 'Технічно цей сайт — теж черговий трекер.')}</p><a className="footer-patreon" href="https://www.patreon.com/15489085/join" target="_blank" rel="noopener noreferrer"><span>{t('Support the project on Patreon — $1/month', 'Підтримати проєкт на Patreon — $1 на місяць')}</span><ArrowUpRight size={16} aria-hidden="true"/></a><a href="#/about">{t('A very unnecessary project', 'Дуже непотрібний проєкт')} <ArrowUpRight size={14}/></a></footer>
    <AnimatePresence mode="wait">{dialog === 'share' && <Dialog key="share" close={closeDialog} label={t('Share the museum', 'Поділитися музеєм')}><span className="eyebrow">{t('SEND HELP. OR SEND THIS LINK.', 'СКИНЬ ДОПОМОГУ. АБО ЦЕ ПОСИЛАННЯ.')}</span><h2>{t('MAKE SOMEONE’S', 'ЗІПСУЙ КОМУСЬ')}<br/>{t('NEXT BUILD AWKWARD.', 'ІДЕЮ ДЛЯ СТАРТАПУ.')}</h2><p>{t('“Bro, somebody actually built a tracker for expense trackers.”', '«Чувак, хтось реально зробив трекер трекерів витрат».')}</p><a className="pill-button dark-button" href={`https://www.threads.net/intent/post?text=${encodeURIComponent(`${t('Somebody actually built a tracker for expense trackers. Humanity has peaked.', 'Хтось реально зробив трекер трекерів витрат. Людство досягло вершини.')}\n\n${shareUrl}`)}`} target="_blank" rel="noopener noreferrer">{t('Share on Threads', 'Поділитися в Threads')} <ArrowUpRight size={20}/></a><button className="pill-button" onClick={copyLink}>{copied ? t('Copied. Go cause a little chaos.', 'Скопійовано. Час посіяти трохи хаосу.') : t('Copy this unnecessary link', 'Скопіювати це непотрібне посилання')}{copied ? <Check size={20}/> : <Copy size={19}/>}</button>{copyFailed && <label className="copy-fallback">{t('Copy the link below:', 'Скопіюй посилання нижче:')}<input readOnly value={shareUrl} onFocus={e => e.target.select()}/></label>}<span className="mono small">{t('THE INTERNET DIDN’T ASK. TELL IT ANYWAY.', 'ІНТЕРНЕТ НЕ ПРОСИВ. А ТИ ВСЕ ОДНО ПОКАЖИ.')}</span></Dialog>}{dialog === 'easter' && <Dialog key="easter" close={closeDialog} label={t('Certificate of wheel reinvention', 'Сертифікат винахідника велосипеда')}><span className="eyebrow">{t('OFFICIAL CERTIFICATE OF PARTICIPATION', 'ОФІЦІЙНИЙ СЕРТИФІКАТ УЧАСТІ')}</span><div className="certificate-seal"><ReceiptText size={47}/></div><h2>{t('OF COURSE', 'НУ ЗВІСНО,')}<br/>{t('YOU DID.', 'ЩО ЗРОБИВ.')}</h2><p>{t('We’re sure yours is different.', 'Ми впевнені, твій зовсім інший.')}<br/>{t('Does it have a pie chart?', 'А кругова діаграма є?')}</p><div className="certificate-note mono">{t('CERTIFIED WHEEL REINVENTOR', 'ДИПЛОМОВАНИЙ ВИНАХІДНИК ВЕЛОСИПЕДА')}<br/>{t('EST. APPROXIMATELY EVERY WEEKEND', 'ВИПУСК НОВИХ ФАХІВЦІВ ЩОВИХІДНИХ')}</div><button className="pill-button dark-button" onClick={() => setDialog('share')}>{t('I deserve to be celebrated', 'Я заслуговую на визнання')} <ArrowUpRight size={20}/></button></Dialog>}</AnimatePresence>
  </>;
}
