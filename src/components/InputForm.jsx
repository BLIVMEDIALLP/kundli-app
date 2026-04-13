import { useState, useRef } from 'react';

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
    name: '', gender: 'Male', dateOfBirth: '', timeOfBirth: '',
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
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" autoComplete="off" />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Time of Birth</label>
            <input type="time" name="timeOfBirth" value={form.timeOfBirth} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Timezone</label>
            <select name="timezone" value={form.timezone} onChange={handleChange}>
              {TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label>Place of Birth</label>
            <div className="place-search-wrapper">
              <input value={placeQuery} onChange={handlePlaceInput} placeholder="Search city or town..." autoComplete="off" />
              {searching && <div className="place-searching">Searching...</div>}
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
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}
        <button type="submit" className="btn-primary">Generate Kundli</button>
      </form>
    </div>
  );
}
