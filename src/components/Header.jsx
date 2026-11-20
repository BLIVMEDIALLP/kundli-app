import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) setNavOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setNavOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="header-inner">
        <a className="brand" href="#" aria-label="Shri Aaum home" onClick={() => setNavOpen(false)}>
          <img src="/shri-aaum-logo.webp" width="99" height="128" alt="" />
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-label="Menu"
          aria-controls="site-nav"
          aria-expanded={navOpen}
          onClick={() => setNavOpen(v => !v)}
        >
          <span aria-hidden="true" />
        </button>
        <nav id="site-nav" aria-label="Main navigation" className={navOpen ? 'is-open' : ''}>
          <a href="#report-guide" onClick={() => setNavOpen(false)}>Report Overview</a>
          <a href="#chart-basics" onClick={() => setNavOpen(false)}>Astrological Profile</a>
          <a href="#faq" onClick={() => setNavOpen(false)}>FAQs</a>
          <a href="#about" onClick={() => setNavOpen(false)}>About</a>
          <a href="#contact" onClick={() => setNavOpen(false)}>Contact</a>
        </nav>
        <div className="header-tools" />
      </div>
    </header>
  );
}
