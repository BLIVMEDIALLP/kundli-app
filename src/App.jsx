import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import { calculateKundli } from './lib/calculator.js';
import { EXAMPLE_PERSON } from './lib/constants.js';

function pageFromHash() {
  const key = window.location.hash.slice(1);
  return key === 'about' || key === 'contact' ? key : 'home';
}

export default function App() {
  const [page, setPage] = useState(pageFromHash);

  // Kundli report state — lifted above HomePage so the Footer/Header (which live
  // outside HomePage) can also trigger the sample report from any page.
  const [kundliState, setKundliState] = useState('form'); // form | loading | report | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [initialTab, setInitialTab] = useState('basic');
  const [isExample, setIsExample] = useState(false);
  const [reportKey, setReportKey] = useState(0);

  useEffect(() => {
    function onHashChange() { setPage(pageFromHash()); }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const generate = useCallback(async (formData, { tab = 'basic', example = false } = {}) => {
    setKundliState('loading');
    setError(null);
    try {
      const data = await calculateKundli(formData);
      setResult(data);
      setIsExample(example);
      setInitialTab(tab);
      setReportKey(k => k + 1);
      setKundliState('report');
      if (page !== 'home') window.location.hash = '';
    } catch (err) {
      console.error('Calculation error:', err);
      setError(err.message || 'Calculation failed. Please check your inputs.');
      setKundliState('error');
    }
  }, [page]);

  useEffect(() => {
    if (kundliState !== 'report') return;
    const el = document.getElementById('report');
    if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [reportKey, kundliState]);

  function handleBack() {
    setKundliState('form');
    setResult(null);
    setError(null);
  }

  function handleSample(tab = 'basic') {
    generate(EXAMPLE_PERSON, { tab, example: true });
  }

  return (
    <>
      <a className="skip" href="#create">Skip to birth details</a>
      <Header />
      {page === 'about' && <AboutPage onSample={handleSample} />}
      {page === 'contact' && <ContactPage />}
      {page === 'home' && (
        <HomePage
          kundliState={kundliState}
          result={result}
          error={error}
          initialTab={initialTab}
          isExample={isExample}
          reportKey={reportKey}
          onGenerate={generate}
          onSample={handleSample}
          onBack={handleBack}
        />
      )}
      <Footer onSample={handleSample} />
    </>
  );
}
