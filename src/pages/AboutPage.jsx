export default function AboutPage({ onSample }) {
  return (
    <main id="about" className="inner-page">
      <section className="chapter inner-chapter inner-intro" aria-labelledby="about-title">
        <img className="inner-art" src="/about-kundli.webp" width="950" height="633" alt="Vedic birth-chart manuscript beside a bronze astrolabe" />
        <div className="wrap inner-heading">
          <div className="inner-intro-copy">
            <div className="inner-brand"><img className="shri-logo" src="/shri-aaum-logo.webp" width="99" height="128" alt="" /><span>Shri Aaum</span></div>
            <h1 id="about-title" tabIndex={-1}>About Kundli</h1>
            <p>Explore the Vedic birth chart and the planetary placements that shape a Kundli report.</p>
          </div>
        </div>
      </section>
      <section className="chapter inner-chapter inner-content" aria-labelledby="about-explore">
        <div className="wrap inner-grid">
          <div>
            <h2 id="about-explore">Read your birth chart</h2>
            <p>
              Shri Aaum Kundli calculates your Vedic birth chart entirely in your browser, using Swiss Ephemeris
              (compiled to WebAssembly) with the Lahiri ayanamsha — the same astronomical data professional
              Jyotish software relies on. Nothing is sent to a server.
            </p>
          </div>
          <div className="inner-list">
            <p><strong>Birth details</strong> Enter your name, date, time and place of birth — or try the form with example details.</p>
            <p><strong>Astrological profile</strong> Learn what Lagna, Rashi and Nakshatra mean.</p>
            <p><strong>Full report</strong> Browse planetary positions, houses, KP, Dasha, Doshas and Navamsha (D9), or save a PDF copy.</p>
            <button className="button primary" type="button" onClick={() => onSample('basic')}>
              View sample report <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
