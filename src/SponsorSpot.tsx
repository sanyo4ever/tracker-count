import { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { useLocale } from './i18n';
import './sponsor.css';

type SponsorApp = { name: string; storeUrl: string; iconUrl?: string };
const paypalEmail = 'sanyo4ever@gmail.com';

export default function SponsorSpot({ app }: { app: SponsorApp }) {
  const { t } = useLocale();
  const [iconFailed, setIconFailed] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  async function copyPaypal() {
    try {
      await navigator.clipboard.writeText(paypalEmail);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
  }

  return <section className="sponsor-spot page-width" aria-labelledby="sponsor-heading">
    <div className="sponsor-disclosure">
      <span>{t('ADVERTISEMENT', 'РЕКЛАМА')}</span><span aria-hidden="true">·</span> {t('THE MUSEUM HAS SOLD OUT', 'МУЗЕЙ ПРОДАВСЯ')}
    </div>
    <h2 id="sponsor-heading" className="sponsor-heading">{t('Turns out, this thing', 'Виявляється, це')}<br/>{t('makes money.', 'приносить гроші.')}</h2>
    <a
      className="sponsor-app"
      href={app.storeUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      aria-label={t(`Meet ${app.name} on the App Store (opens in a new tab)`, `${app.name} в App Store (відкриється в новій вкладці)`)}
    >
      {app.iconUrl && !iconFailed
        ? <img className="sponsor-icon" src={app.iconUrl} alt="" width="56" height="56" onError={() => setIconFailed(true)} />
        : <span className="sponsor-icon sponsor-icon-fallback" aria-hidden="true">L</span>}
      <span className="sponsor-app-copy">
        <strong>Lichy</strong>
        <span className="sponsor-app-description">{t('Expenses. By text, voice, or receipt.', 'Витрати. Текстом, голосом або чеком.')}</span>
        <span className="sponsor-app-link">{t('Meet Lichy', 'Знайомтеся: Lichy')} <ArrowUpRight size={14} aria-hidden="true" /></span>
      </span>
    </a>
    <div className="sponsor-ticket" aria-label={t('This sponsored spot: a 100 Ukrainian hryvnia donation deal', 'Це рекламне місце: домовленість про донат у 100 гривень')}>
      <span className="sponsor-ticket-label">{t('THIS SPOT', 'ЦЕ МІСЦЕ')}</span>
      <strong><span>₴</span>100</strong>
      <span className="sponsor-ticket-note">{t('DONATION DEAL', 'ЗА ДОНАТ')}</span>
      <span className="sponsor-ticket-stamp" aria-hidden="true">{t('VERY COMMERCIAL', 'ДУЖЕ КОМЕРЦІЙНО')}</span>
    </div>
    <p className="sponsor-policy"><ArrowUpRight size={13} aria-hidden="true"/><span><strong>{t('Donate more for your app. Get placed higher.', 'Задонатьте більше за свій застосунок — поставимо вище.')}</strong> {t('That’s the entire ranking algorithm.', 'Ось і весь алгоритм ранжування.')}</span></p>
    <div className="sponsor-donate">
      <div className="sponsor-donate-details">
        <span className="sponsor-donate-label">{t('FUND THE ABSURDITY', 'ПРОФІНАНСУЙ ЦЕЙ АБСУРД')}</span>
        <span className="sponsor-paypal-address"><strong>PayPal</strong><span>{paypalEmail}</span></span>
      </div>
      <button className="sponsor-copy" onClick={copyPaypal} aria-label={t('Copy PayPal email address', 'Скопіювати адресу PayPal')}>
        {copyStatus === 'copied' ? <Check size={14} aria-hidden="true"/> : <Copy size={14} aria-hidden="true"/>}
        <span aria-live="polite">{copyStatus === 'copied' ? t('Copied!', 'Скопійовано!') : t('Copy', 'Копіювати')}</span>
      </button>
      {copyStatus === 'error' && <label className="sponsor-copy-fallback" role="status">
        {t('Copy this address manually:', 'Скопіюй цю адресу вручну:')}
        <input readOnly aria-label={t('PayPal email address', 'Адреса PayPal')} value={paypalEmail} onFocus={event => event.target.select()} />
      </label>}
    </div>
  </section>;
}
