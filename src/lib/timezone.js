// Resolves the DST-aware UTC offset (in hours) for a birth date/time at a given IANA time zone,
// using the browser's own tz database via Intl rather than a fixed longitude estimate.
export function getUtcOffsetHours(dateStr, timeStr, timeZone) {
  if (!timeZone || !dateStr) return null;
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [hh, mm] = (timeStr || '12:00').split(':').map(Number);
  if (!y || !mo || !d) return null;

  const offsetAt = (instant) => {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-US', {
        timeZone, hour12: false,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }).formatToParts(instant).map(p => [p.type, p.value])
    );
    const hour = parts.hour === '24' ? 0 : Number(parts.hour);
    const asUtcMs = Date.UTC(
      Number(parts.year), Number(parts.month) - 1, Number(parts.day),
      hour, Number(parts.minute), Number(parts.second)
    );
    return (asUtcMs - instant.getTime()) / 3600000;
  };

  const guessMs = Date.UTC(y, mo - 1, d, hh || 0, mm || 0);
  const firstPass = offsetAt(new Date(guessMs));
  // Second pass re-probes near the true instant, correcting the estimate across DST transitions.
  const secondPass = offsetAt(new Date(guessMs - firstPass * 3600000));

  return Math.round(secondPass * 4) / 4; // snap to the nearest quarter hour
}

export function formatUtcOffset(hours) {
  const sign = hours < 0 ? '-' : '+';
  const abs = Math.abs(hours);
  const wholeHours = Math.floor(abs);
  const minutes = Math.round((abs - wholeHours) * 60);
  return `${sign}${wholeHours}${minutes ? ':' + String(minutes).padStart(2, '0') : ''}`;
}
