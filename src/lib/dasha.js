import { DASHA_SEQUENCE, DASHA_YEARS, NAKSHATRA_SPAN } from './constants.js';

export function calcVimshottariDasha(moonPosition, dateOfBirthStr) {
  const { nakshatraIndex, longitude: moonLong } = moonPosition;

  const nakshatraLords = [
    'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
    'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
    'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
  ];
  const birthDashaLord = nakshatraLords[nakshatraIndex];

  const nakshatraStart = nakshatraIndex * NAKSHATRA_SPAN;
  const moonPositionInNakshatra = moonLong - nakshatraStart;
  const fractionElapsed = moonPositionInNakshatra / NAKSHATRA_SPAN;
  const dashaYears = DASHA_YEARS[birthDashaLord];
  const balanceYears = dashaYears * (1 - fractionElapsed);

  const birthDate = new Date(dateOfBirthStr);
  const today = new Date();

  const timeline = buildDashaTimeline(birthDashaLord, balanceYears, birthDate);
  const current = findCurrentDasha(timeline, today);

  return {
    birthDashaLord,
    dashaBalance: parseFloat(balanceYears.toFixed(4)),
    timeline: timeline.slice(0, 12),
    current,
  };
}

function buildDashaTimeline(startLord, balanceYears, birthDate) {
  const timeline = [];
  const startIndex = DASHA_SEQUENCE.indexOf(startLord);
  let currentDate = new Date(birthDate);

  for (let i = 0; i < 9; i++) {
    const idx = (startIndex + i) % 9;
    const lord = DASHA_SEQUENCE[idx];
    const years = i === 0 ? balanceYears : DASHA_YEARS[lord];
    const endDate = addYears(currentDate, years);
    const antardashas = calcAntardashas(lord, years, new Date(currentDate));

    timeline.push({
      lord,
      years: parseFloat(years.toFixed(4)),
      start: currentDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      antardashas,
    });
    currentDate = endDate;
  }
  return timeline;
}

function calcAntardashas(mahaLord, mahaYears, startDate) {
  const antars = [];
  const startIndex = DASHA_SEQUENCE.indexOf(mahaLord);
  let current = new Date(startDate);

  for (let i = 0; i < 9; i++) {
    const idx = (startIndex + i) % 9;
    const antarLord = DASHA_SEQUENCE[idx];
    const antarYears = (DASHA_YEARS[antarLord] / 120) * mahaYears;
    const end = addYears(current, antarYears);

    antars.push({
      lord: antarLord,
      years: parseFloat(antarYears.toFixed(4)),
      start: current.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    });
    current = end;
  }
  return antars;
}

function findCurrentDasha(timeline, today) {
  for (const maha of timeline) {
    const start = new Date(maha.start);
    const end = new Date(maha.end);
    if (today >= start && today < end) {
      for (const antar of maha.antardashas) {
        const aStart = new Date(antar.start);
        const aEnd = new Date(antar.end);
        if (today >= aStart && today < aEnd) {
          return {
            mahadasha: maha.lord, antardasha: antar.lord,
            mahaStart: maha.start, mahaEnd: maha.end,
            antarStart: antar.start, antarEnd: antar.end,
          };
        }
      }
      return { mahadasha: maha.lord, antardasha: null, mahaStart: maha.start, mahaEnd: maha.end };
    }
  }
  return null;
}

function addYears(date, years) {
  return new Date(date.getTime() + years * 365.25 * 24 * 60 * 60 * 1000);
}
