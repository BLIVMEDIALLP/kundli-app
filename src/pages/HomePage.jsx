import { useState } from 'react';
import InputForm from '../components/InputForm.jsx';
import Report from '../components/Report.jsx';

const FAQS = [
  ['What is a Janam Kundli?', 'In Vedic astrology, a Janam Kundli is a birth chart that shows where the planets were positioned at the time and place of birth.'],
  ['Do I need my exact birth details?', 'You can try the form with the "Use example details" button, which fills in a real example birth chart. For your own chart, enter your real name, date, time and place of birth.'],
  ['What if I don’t know my exact birth time?', 'Use a birth record if available. An approximate time can change the Ascendant and house placements.'],
  ['Which charts are included in the report?', 'The Charts tab shows North Indian and South Indian Lagna charts, plus a Bhav Chalit (Placidus) layout. The Navamsha (D9) tab shows the Navamsha chart.'],
  ['Can I download the report?', 'Open your report, choose "Save as PDF", then select the PDF option in your browser’s print dialog.'],
  ['Is my birth data sent anywhere?', 'All calculations run in your browser using Swiss Ephemeris (WebAssembly). Only the place search queries OpenStreetMap; nothing else leaves your device.'],
];

export default function HomePage({ kundliState, result, error, initialTab, isExample, reportKey, onGenerate, onSample, onBack }) {
  return (
    <main id="home-page">
      <div className="hero-chapter chapter">
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <div className="eyebrow hero-kicker"><span aria-hidden="true">✦</span><span>VEDIC ASTROLOGY</span><span aria-hidden="true">✦</span></div>
              <h1 id="hero-title">Discover your<br /> <em>Janam Kundli</em></h1>
              <p>Explore the planets, houses, and patterns in your Vedic birth chart.</p>
              <div className="hero-actions">
                <button className="button primary" type="button" onClick={() => onSample('basic')}>
                  View sample report <span aria-hidden="true">→</span>
                </button>
                <a className="sample-hero" href="#create">Preview the birth form <span aria-hidden="true">→</span></a>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true" />
          </div>
        </section>
        <div className="feature-strip">
          <div className="wrap">
            <span><i aria-hidden="true">✧</i> Vedic birth charts</span>
            <span><i aria-hidden="true">◈</i> Planetary &amp; Dasha insights</span>
            <span><i aria-hidden="true">↓</i> Downloadable report</span>
          </div>
        </div>
      </div>

      <section id="create" className="birth-section chapter" aria-labelledby="birth-title">
        <div className="birth-heading">
          <span className="section-emblem" aria-hidden="true"><img src="/shri-aaum-logo.webp" width="99" height="128" alt="" /></span>
          <div className="eyebrow"><span aria-hidden="true">✦</span><span>JANAM KUNDLI</span><span aria-hidden="true">✦</span></div>
          <h2 id="birth-title">Create your birth chart</h2>
          <p>Enter your birth details below, or try the form with a real example chart first.</p>
        </div>
        <div className="birth-form-panel brand-watermark">
          <div className="card-heading">
            <span className="card-mark" aria-hidden="true">✧</span>
            <div><h3>Birth details</h3><p>All calculations run in your browser.</p></div>
          </div>
          <InputForm onSubmit={onGenerate} />
        </div>
      </section>

      {kundliState === 'loading' && (
        <section className="birth-section chapter" style={{ paddingTop: 0 }}>
          <div className="loading-wrapper">
            <div className="spinner" />
            <p>Calculating planetary positions...</p>
            <p className="loading-sub">Computing Swiss Ephemeris data via WebAssembly</p>
          </div>
        </section>
      )}

      {kundliState === 'error' && (
        <section className="birth-section chapter" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="error-msg">{error}</div>
          </div>
        </section>
      )}

      {kundliState === 'report' && result && (
        <Report key={reportKey} data={result} onBack={onBack} initialTab={initialTab} isExample={isExample} />
      )}

      <section id="report-guide" className="guide chapter brand-watermark" aria-labelledby="guide-title">
        <div className="wrap guide-inner">
          <div className="section-title">
            <span className="section-emblem" aria-hidden="true"><img src="/shri-aaum-logo.webp" width="99" height="128" alt="" /></span>
            <h2 id="guide-title">Inside your<br /> <em>Kundli</em></h2>
            <p>Explore the sample report by topic.</p>
          </div>
          <div className="guide-grid">
            <button type="button" className="guide-card" onClick={() => onSample('charts')}>
              <span className="guide-icon" aria-hidden="true">◇</span>
              <span className="guide-copy"><strong>Birth charts</strong><span>Explore the sample Lagna and Navamsha (D9) charts.</span></span>
              <span className="guide-arrow" aria-hidden="true">→</span>
            </button>
            <button type="button" className="guide-card" onClick={() => onSample('planets')}>
              <span className="guide-icon" aria-hidden="true">☉</span>
              <span className="guide-copy"><strong>Planets &amp; houses</strong><span>Find planetary placements, house meanings and KP details.</span></span>
              <span className="guide-arrow" aria-hidden="true">→</span>
            </button>
            <button type="button" className="guide-card" onClick={() => onSample('dasha')}>
              <span className="guide-icon" aria-hidden="true">◷</span>
              <span className="guide-copy"><strong>Dasha &amp; Doshas</strong><span>Explore planetary periods and traditional Dosha assessments.</span></span>
              <span className="guide-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      <ProfileSection onSample={onSample} />

      <section id="faq" className="faq-chapter chapter" aria-labelledby="faq-title">
        <div className="faq wrap">
          <div>
            <span className="section-emblem" aria-hidden="true"><img src="/shri-aaum-logo.webp" width="99" height="128" alt="" /></span>
            <h2 id="faq-title">Before you<br /> <em>begin</em></h2>
          </div>
          <div className="questions">
            {FAQS.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-cta chapter" aria-labelledby="closing-title">
        <div className="wrap">
          <h2 id="closing-title">Explore a <em>birth chart</em></h2>
          <button className="button closing-button" type="button" onClick={() => onSample('basic')}>
            View sample Kundli <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <div className="mobile-cta"><a className="button primary" href="#create">Birth Form <span aria-hidden="true">→</span></a></div>
    </main>
  );
}

function ProfileSection({ onSample }) {
  const [open, setOpen] = useState('lagna');
  const rows = [
    { id: 'lagna', title: 'Lagna', sub: 'Ascendant', text: 'The zodiac sign rising on the eastern horizon at the time of your birth. It sets the starting point for your chart’s houses.' },
    { id: 'rashi', title: 'Rashi', sub: 'Moon sign', text: 'In your Kundli report, Rashi is the zodiac sign the Moon occupied when you were born.' },
    { id: 'nakshatra', title: 'Nakshatra', sub: 'Lunar mansion', text: 'The lunar mansion the Moon occupied at birth. The report also shows its Pada, or subdivision.' },
  ];
  return (
    <section id="chart-basics" className="astrological-profile chapter" aria-labelledby="profile-title">
      <div className="wrap profile-inner">
        <span className="profile-watermark" aria-hidden="true">Profile</span>
        <span className="section-emblem" aria-hidden="true"><img src="/shri-aaum-logo.webp" width="99" height="128" alt="" /></span>
        <h2 id="profile-title">Astrological <em>Profile</em></h2>
        <p>Three placements to start reading your birth chart.</p>
        <div className="profile-rows">
          {rows.map(row => (
            <article className="profile-row" key={row.id}>
              <h3>
                <button type="button" aria-expanded={open === row.id} onClick={() => setOpen(open === row.id ? null : row.id)}>
                  {row.title} <span>{row.sub}</span>
                </button>
              </h3>
              <p hidden={open !== row.id}>{row.text}</p>
            </article>
          ))}
        </div>
        <button className="button outline profile-action" type="button" onClick={() => onSample('basic')}>
          See the sample profile <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
