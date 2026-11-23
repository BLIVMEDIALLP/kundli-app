import { useState, useRef, useEffect, useMemo } from 'react';
import tzlookup from 'tz-lookup';
import { EXAMPLE_PERSON } from '../lib/constants.js';
import { getUtcOffsetHours, formatUtcOffset } from '../lib/timezone.js';

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

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function InputForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '', gender: '', dateOfBirth: '', timeOfBirth: '',
    placeOfBirth: '', latitude: '', longitude: '', timezone: 5.5,
  });
  const [placeQuery, setPlaceQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [ianaZone, setIanaZone] = useState(null);
  const [autoTzLocked, setAutoTzLocked] = useState(false);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);
  const maxDate = useMemo(todayStr, []);
  const minDate = '1900-01-01';

  // Re-derive the UTC offset whenever the birth date/time changes, as long as the place's
  // time zone was auto-detected and the user hasn't manually overridden it since.
  useEffect(() => {
    if (!autoTzLocked || !ianaZone) return;
    const tz = getUtcOffsetHours(form.dateOfBirth, form.timeOfBirth, ianaZone);
    if (tz != null) {
      setForm(prev => (prev.timezone === tz ? prev : { ...prev, timezone: tz }));
    }
  }, [form.dateOfBirth, form.timeOfBirth, ianaZone, autoTzLocked]);

  const timezoneOptions = useMemo(() => {
    const tzNum = parseFloat(form.timezone);
    if (TIMEZONES.some(tz => tz.value === tzNum)) return TIMEZONES;
    const label = ianaZone
      ? `Auto-detected — ${ianaZone} (UTC${formatUtcOffset(tzNum)})`
      : `Custom (UTC${formatUtcOffset(tzNum)})`;
    return [{ label, value: tzNum }, ...TIMEZONES];
  }, [form.timezone, ianaZone]);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'timezone') setAutoTzLocked(false);
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handlePlaceInput(e) {
    const val = e.target.value;
    setPlaceQuery(val);
    setHighlightedIndex(-1);
    // Clear stale suggestions immediately so a query change can never leave the previous
    // query's results selectable while the new search is still in flight.
    setSuggestions([]);
    setForm(prev => ({ ...prev, placeOfBirth: val, latitude: '', longitude: '' }));

    clearTimeout(debounceRef.current);
    const requestId = ++requestIdRef.current;
    if (val.length < 3) return;

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5&addressdetails=1`;
        const res = await fetch(url, {
          headers: { 'Accept-Language': 'en', 'User-Agent': 'ShriAaumKundli/1.0' },
        });
        // Ignore a response for a query that's no longer the latest one — requests can
        // resolve out of order, which would otherwise repopulate stale suggestions.
        if (requestId !== requestIdRef.current) return;
        if (res.ok) {
          const data = await res.json();
          if (requestId === requestIdRef.current) setSuggestions(data.slice(0, 5));
        }
      } catch (_) {
        if (requestId === requestIdRef.current) setSuggestions([]);
      } finally {
        if (requestId === requestIdRef.current) setSearching(false);
      }
    }, 400);
  }

  function selectSuggestion(s) {
    const displayName = s.display_name;
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);

    let zone = null;
    try { zone = tzlookup(lat, lon); } catch (_) { zone = null; }

    requestIdRef.current++;
    setPlaceQuery(displayName);
    setSuggestions([]);
    setHighlightedIndex(-1);
    setIanaZone(zone);
    setAutoTzLocked(!!zone);

    setForm(prev => {
      const dstAwareTz = zone ? getUtcOffsetHours(prev.dateOfBirth, prev.timeOfBirth, zone) : null;
      const timezone = dstAwareTz != null ? dstAwareTz : Math.round(lon / 15 * 2) / 2;
      return {
        ...prev, placeOfBirth: displayName,
        latitude: lat, longitude: lon, timezone,
      };
    });
  }

  function handlePlaceKeyDown(e) {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0) {
        e.preventDefault();
        selectSuggestion(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setHighlightedIndex(-1);
    }
  }

  function fillExample() {
    requestIdRef.current++;
    setError('');
    setSuggestions([]);
    setHighlightedIndex(-1);
    setIanaZone(null);
    setAutoTzLocked(false);
    setPlaceQuery(EXAMPLE_PERSON.placeOfBirth);
    setForm({ ...EXAMPLE_PERSON });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Please enter a name.');
    if (!form.dateOfBirth) return setError('Please enter date of birth.');
    if (form.dateOfBirth > maxDate) return setError('Date of birth cannot be in the future.');
    if (form.dateOfBirth < minDate) return setError('Date of birth must be on or after 1 January 1900.');
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
    <form id="birth-form" onSubmit={handleSubmit} noValidate>
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
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} min={minDate} max={maxDate} />
        </label>
        <label>Time of birth
          <input type="time" name="timeOfBirth" value={form.timeOfBirth} onChange={handleChange} />
        </label>
        <label>Place of birth
          <div className="place-search-wrapper">
            <input
              value={placeQuery}
              onChange={handlePlaceInput}
              onKeyDown={handlePlaceKeyDown}
              placeholder="Enter city or town"
              autoComplete="off"
              role="combobox"
              aria-expanded={suggestions.length > 0}
              aria-controls="place-listbox"
              aria-autocomplete="list"
              aria-activedescendant={highlightedIndex >= 0 ? `place-option-${highlightedIndex}` : undefined}
            />
            {searching && <div className="place-searching">Searching…</div>}
            {suggestions.length > 0 && (
              <div className="place-suggestions" id="place-listbox" role="listbox">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    id={`place-option-${i}`}
                    role="option"
                    aria-selected={highlightedIndex === i}
                    className={`place-suggestion ${highlightedIndex === i ? 'highlighted' : ''}`}
                    onMouseEnter={() => setHighlightedIndex(i)}
                    onClick={() => selectSuggestion(s)}
                  >
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
          <select name="timezone" value={parseFloat(form.timezone)} onChange={handleChange}>
            {timezoneOptions.map(tz => (
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
