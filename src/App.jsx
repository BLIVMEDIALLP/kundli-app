import { useState } from 'react';
import InputForm from './components/InputForm';
import Report from './components/Report';
import { calculateKundli } from './lib/calculator';

export default function App() {
  const [state, setState] = useState('form');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(formData) {
    setState('loading');
    setError(null);
    try {
      const data = await calculateKundli(formData);
      setResult(data);
      setState('report');
    } catch (err) {
      console.error('Calculation error:', err);
      setError(err.message || 'Calculation failed. Please check your inputs.');
      setState('error');
    }
  }

  function handleBack() {
    setState('form');
    setResult(null);
    setError(null);
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Kundli</h1>
        <p>Vedic Birth Chart &amp; Astrological Analysis</p>
      </header>

      {state === 'form' && <InputForm onSubmit={handleSubmit} />}

      {state === 'loading' && (
        <div className="loading-wrapper">
          <div className="spinner" />
          <p>Calculating planetary positions...</p>
          <p className="loading-sub">Computing Swiss Ephemeris data via WebAssembly</p>
        </div>
      )}

      {state === 'report' && result && (
        <Report data={result} onBack={handleBack} />
      )}

      {state === 'error' && (
        <div>
          <div className="form-card">
            <div className="error-msg">{error}</div>
            <button className="btn-primary" onClick={handleBack} style={{ marginTop: '1rem' }}>
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
