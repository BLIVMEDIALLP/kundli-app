import { useState, useRef } from 'react';
import { EXAMPLE_PERSON } from '../lib/constants.js';

const TIMEZONES = [
  { label: 'IST — India (UTC+5:30)', value: 5.5 },
  { label: 'UTC (UTC+0)', value: 0 },
  { label: 'EST — Eastern US (UTC−5)', value: -5 },
  { label: 'CST — Central US (UTC−6)', value: -6 },
  { label: 'PST — Pacific US (UTC−8)', value: -8 },
  { label: 'GMT+1 (UTC+1)', value: 1 },
  { label: 'CET (UTC+2)', value: 2 },
  { label: 'GST — Gulf (UTC+4)', value: 4 },
  { label: 'SGT — Singapore (UTC+8)', value: 8 },
  { label: 'JST — Japan (UTC+9)', value: 9 },
  { label: 'AEST — Australia East (UTC+10)', value: 10 },
];

export default function InputForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '', gender: '', dateOfBirth: '', timeOfBirth: '',
    placeOfBirth: '', latitude: '', longitude: '', timezone: 5.5,
  });
  const [placeQuery, setPlaceQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handlePlaceInput(e) {
    const val = e.target.value;
    setPlaceQuery(val);
    setForm(prev => ({ ...prev, placeOfBirth: val, latitude: '', longitude: '' }));

    clearTimeout(debounceRef.current);
    if (val.length < 3) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5&addressdetails=1`;
        const res = await fetch(url, {
          headers: { 'Accept-Language': 'en', 'User-Agent': 'ShriAaumKundli/1.0' },
        });
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.slice(0, 5));
        }
      } catch (_) {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }

  function selectSuggestion(s) {
    const displayName = s.display_name;
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);
    const autoTz = Math.round(lon / 15 * 2) / 2;

    setPlaceQuery(displayName);
    setForm(prev => ({
      ...prev, placeOfBirth: displayName,
      latitude: lat, longitude: lon, timezone: autoTz,
    }));
    setSuggestions([]);
  }

  function fillExample() {
    setError('');
    setSuggestions([]);
    setPlaceQuery(EXAMPLE_PERSON.placeOfBirth);
    setForm({ ...EXAMPLE_PERSON });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Please enter a name.');
    if (!form.dateOfBirth) return setError('Please enter date of birth.');
    if (!form.timeOfBirth) return setError('Please enter time of birth.');
    if (!form.latitude || !form.longitude) return setError('Please select a place of birth from the suggestions.');

    onSubmit({
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      timezone: parseFloat(form.timezone),
    });
  }

  return (
    <form id="birth-form" onSubmit={handleSubmit}>
      <div className="fields">
        <label>Full name
          <input name="name" value={form.name} onChange={handleChange} maxLength={90} placeholder="Enter your full name" autoComplete="off" />
        </label>
        <label>Gender
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="" disabled>Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>
        <label>Date of birth
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
        </label>
        <label>Time of birth
          <input type="time" name="timeOfBirth" value={form.timeOfBirth} onChange={handleChange} />
        </label>
        <label>Place of birth
          <div className="place-search-wrapper">
            <input value={placeQuery} onChange={handlePlaceInput} placeholder="Enter city or town" autoComplete="off" />
            {searching && <div className="place-searching">Searching…</div>}
            {suggestions.length > 0 && (
              <div className="place-suggestions">
                {suggestions.map((s, i) => (
                  <div key={i} className="place-suggestion" onClick={() => selectSuggestion(s)}>
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {form.latitude && form.longitude && (
            <div className="coords-display">
              Lat: {parseFloat(form.latitude).toFixed(4)}, Lon: {parseFloat(form.longitude).toFixed(4)}
            </div>
          )}
        </label>
        <label>Time zone
          <select name="timezone" value={form.timezone} onChange={handleChange}>
            {TIMEZONES.map(tz => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </label>
      </div>

      <aside className="tip">
        <span className="tip-icon" aria-hidden="true">◷</span>
        <div><strong>Use your exact birth time</strong><p>The Ascendant can change with the time and location of birth.</p></div>
      </aside>

      {error && <div className="error-msg">{error}</div>}

      <div className="form-actions">
        <button className="button outline" type="button" onClick={fillExample}>Use example details</button>
        <button className="button primary" type="submit">Generate Kundli <span aria-hidden="true">→</span></button>
      </div>
    </form>
  );
}
