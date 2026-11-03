import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import iosUk from './data/ios-uk.json';
import androidUk from './data/android-uk.json';

export type Locale = 'en' | 'uk';
const storageKey = 'yaet-language';
const descriptions: Record<string, string> = { ...iosUk, ...androidUk };
const tags: Record<string, string> = {
  'All exhibits': 'Усі експонати',
  'Ukrainian-made': 'Зроблено в Україні',
  Budgeting: 'Бюджет', Expenses: 'Витрати', 'Shared expenses': 'Спільні витрати',
  Business: 'Бізнес', Bills: 'Рахунки', Receipts: 'Чеки', Travel: 'Подорожі', Vehicles: 'Авто',
};

function initialLocale(): Locale {
  const requested = new URLSearchParams(window.location.search).get('lang');
  if (requested === 'uk' || requested === 'en') return requested;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'uk' || saved === 'en') return saved;
  } catch { /* Language switching also works when storage is unavailable. */ }
  for (const language of navigator.languages || [navigator.language]) {
    const code = language.toLowerCase().split('-')[0];
    if (code === 'uk' || code === 'en') return code;
  }
  return 'en';
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (english: string, ukrainian: string) => string;
};
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>(initialLocale);
  useEffect(() => {
    document.documentElement.lang = locale;
    try { localStorage.setItem(storageKey, locale); } catch { /* Optional persistence. */ }
  }, [locale]);
  function setLocale(next: Locale) {
    updateLocale(next);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', next);
    window.history.replaceState(null, '', url);
  }
  return <LocaleContext.Provider value={{ locale, setLocale, t: (en, uk) => locale === 'uk' ? uk : en }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale requires LocaleProvider');
  return context;
}

export function tagLabel(tag: string, locale: Locale) { return locale === 'uk' ? tags[tag] || tag : tag; }
export function appDescription(app: { id: string; description: string }, locale: Locale) {
  return locale === 'uk' ? descriptions[app.id] || app.description : app.description;
}
