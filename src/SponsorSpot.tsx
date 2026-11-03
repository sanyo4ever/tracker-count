import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './sponsor.css';

type SponsorApp = { name: string; storeUrl: string; iconUrl?: string };

export default function SponsorSpot({ app }: { app: SponsorApp }) {
  const [iconFailed, setIconFailed] = useState(false);

  return <section className="sponsor-spot page-width" aria-labelledby="sponsor-heading">
    <div className="sponsor-disclosure">
      <span>ADVERTISEMENT</span><span aria-hidden="true">·</span> THE MUSEUM HAS SOLD OUT
    </div>
    <h2 id="sponsor-heading" className="sponsor-heading">Turns out, this thing<br/>makes money.</h2>
    <a
      className="sponsor-app"
      href={app.storeUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      aria-label={`Meet ${app.name} on the App Store (opens in a new tab)`}
    >
      {app.iconUrl && !iconFailed
        ? <img className="sponsor-icon" src={app.iconUrl} alt="" width="56" height="56" onError={() => setIconFailed(true)} />
        : <span className="sponsor-icon sponsor-icon-fallback" aria-hidden="true">L</span>}
      <span className="sponsor-app-copy">
        <strong>Lichy</strong>
        <span className="sponsor-app-description">Expenses. By text, voice, or receipt.</span>
        <span className="sponsor-app-link">Meet Lichy <ArrowUpRight size={14} aria-hidden="true" /></span>
      </span>
    </a>
    <div className="sponsor-ticket" aria-label="This sponsored spot: a 100 Ukrainian hryvnia donation deal">
      <span className="sponsor-ticket-label">THIS SPOT</span>
      <strong><span>₴</span>100</strong>
      <span className="sponsor-ticket-note">DONATION DEAL</span>
      <span className="sponsor-ticket-stamp" aria-hidden="true">VERY COMMERCIAL</span>
    </div>
    <p className="sponsor-policy"><ArrowUpRight size={13} aria-hidden="true"/><span><strong>Donate more for your app. Get placed higher.</strong> That’s the entire ranking algorithm.</span></p>
  </section>;
}
