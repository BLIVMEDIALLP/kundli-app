const SITE_URL = 'https://shriaaum.com';

export default function Footer({ onSample }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-inner">
          <div className="footer-brand">
            <a className="brand" href="#" aria-label="Shri Aaum home">
              <img src="/shri-aaum-logo.webp" width="99" height="128" alt="" />
            </a>
            <p>A Vedic birth-chart generator. Explore planetary placements, houses and Dasha periods from your own Kundli report.</p>
            <a className="shri-footer-link" href="https://shriaaum.com/" target="_blank" rel="noopener noreferrer">
              shriaaum.com <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="footer-group">
            <h2>Explore</h2>
            <ul>
              <li><a href="#create">Birth Form</a></li>
              <li><a href="#report-guide">Report Overview</a></li>
              <li><a href="#chart-basics">Astrological Profile</a></li>
              <li><a href="#faq">FAQs</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-group">
            <h2>Sample report</h2>
            <ul>
              <li><button type="button" onClick={() => onSample?.('charts')}>Birth Charts</button></li>
              <li><button type="button" onClick={() => onSample?.('planets')}>Planetary Placements</button></li>
              <li><button type="button" onClick={() => onSample?.('dasha')}>Dasha Periods</button></li>
            </ul>
            <div className="footer-share">
              <p>Share Kundli</p>
              <div className="social-links">
                <a href={`https://wa.me/?text=${encodeURIComponent(SITE_URL)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.4 11.8a8.4 8.4 0 0 1-12.3 7.5L4 20.4l1.1-4a8.4 8.4 0 1 1 15.3-4.6Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9 7.7c.2-.2.6-.2.8.1l1 1.9c.1.3 0 .5-.3.8l-.5.5c.6 1.2 1.5 2.1 2.8 2.8l.6-.7c.2-.2.5-.3.8-.2l1.9.9c.3.2.4.5.3.8-.4 1-1.3 1.4-2.2 1.3-2.9-.6-5.5-3-6.2-5.8-.2-1 .2-1.9 1-2.4Z" /></svg>
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M13.7 21v-8.2h2.7l.4-3.2h-3.1V7.5c0-.9.3-1.5 1.6-1.5H17V3.1C16.4 3 15.6 3 14.7 3c-2.5 0-4.3 1.5-4.3 4.4v2.2H7.6v3.2h2.8V21z" /></svg>
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M4 9h3.5v11H4zm1.8-5.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10 9h3.3v1.5h.1c.5-.9 1.6-1.8 3.3-1.8 3.5 0 4.1 2.2 4.1 5.2V20h-3.5v-5.4c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V20H10z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Shri Aaum Kundli. All Rights Reserved.</span>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
