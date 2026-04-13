// KP System — Krishnamurti Paddhati
// Uses Placidus houses, Nakshatra-based sub-lord divisions
// Sub-divisions follow Vimshottari Dasha proportions within each Nakshatra

import { SIGNS, SIGN_LORDS, NAKSHATRAS, NAKSHATRA_LORDS, NAKSHATRA_SPAN, DASHA_YEARS, DASHA_SEQUENCE } from './constants.js';

const TOTAL_DASHA_YEARS = 120; // Vimshottari total cycle

// Build KP sub-lord lookup table
// Each Nakshatra (13°20') is divided into 9 subs proportional to dasha years
function buildSubLordTable() {
  const table = []; // Array of { startDeg, endDeg, nakshatraLord, subLord }

  for (let nk = 0; nk < 27; nk++) {
    const nkStart = nk * NAKSHATRA_SPAN;
    const nkLord = NAKSHATRA_LORDS[nk];
    const nkLordIndex = DASHA_SEQUENCE.indexOf(nkLord);
    let offset = nkStart;

    for (let i = 0; i < 9; i++) {
      const subLordIdx = (nkLordIndex + i) % 9;
      const subLord = DASHA_SEQUENCE[subLordIdx];
      const subSpan = (DASHA_YEARS[subLord] / TOTAL_DASHA_YEARS) * NAKSHATRA_SPAN;

      table.push({
        startDeg: offset,
        endDeg: offset + subSpan,
        nakshatraIndex: nk,
        nakshatraLord: nkLord,
        subLord: subLord,
      });
      offset += subSpan;
    }
  }
  return table;
}

const SUB_LORD_TABLE = buildSubLordTable();

function getSubLord(longitude) {
  const normLon = ((longitude % 360) + 360) % 360;
  for (const entry of SUB_LORD_TABLE) {
    if (normLon >= entry.startDeg && normLon < entry.endDeg) {
      return entry.subLord;
    }
  }
  // Edge case: last entry
  return SUB_LORD_TABLE[SUB_LORD_TABLE.length - 1].subLord;
}

function getSignLord(longitude) {
  const signIndex = Math.floor(((longitude % 360) + 360) % 360 / 30);
  return SIGN_LORDS[SIGNS[signIndex]];
}

function getStarLord(longitude) {
  const normLon = ((longitude % 360) + 360) % 360;
  const nkIndex = Math.floor(normLon / NAKSHATRA_SPAN);
  return NAKSHATRA_LORDS[nkIndex];
}

function getSign(longitude) {
  const signIndex = Math.floor(((longitude % 360) + 360) % 360 / 30);
  return SIGNS[signIndex];
}

function getNakshatra(longitude) {
  const normLon = ((longitude % 360) + 360) % 360;
  const nkIndex = Math.floor(normLon / NAKSHATRA_SPAN);
  return NAKSHATRAS[nkIndex];
}

function getDegreeInSign(longitude) {
  return ((longitude % 360) + 360) % 360 % 30;
}

// Calculate KP cusps from Placidus house system
// swe = initialized SwissEph instance
export function calcKPSystem(swe, jd, lat, lon, planets) {
  // Get Placidus cusps (tropical) — call WASM directly (library wrapper missing output buffers)
  const module = swe.SweModule;
  const cuspsPtr = module._malloc(13 * Float64Array.BYTES_PER_ELEMENT);
  const ascmcPtr = module._malloc(10 * Float64Array.BYTES_PER_ELEMENT);
  module.ccall(
    'swe_houses', 'number',
    ['number', 'number', 'number', 'number', 'pointer', 'pointer'],
    [jd, lat, lon, 'P'.charCodeAt(0), cuspsPtr, ascmcPtr]
  );
  const rawCusps = new Float64Array(module.HEAPF64.buffer, cuspsPtr, 13);
  module._free(cuspsPtr);
  module._free(ascmcPtr);

  const ayanamsha = swe.get_ayanamsa_ut(jd);

  // cusps[0] is unused, cusps[1..12] are the 12 house cusps
  const cusps = [];
  for (let i = 1; i <= 12; i++) {
    const tropicalCusp = rawCusps[i];
    const siderealCusp = ((tropicalCusp - ayanamsha) % 360 + 360) % 360;
    cusps.push({
      house: i,
      degree: parseFloat(getDegreeInSign(siderealCusp).toFixed(2)),
      fullDegree: parseFloat(siderealCusp.toFixed(4)),
      sign: getSign(siderealCusp),
      signLord: getSignLord(siderealCusp),
      starLord: getStarLord(siderealCusp),
      subLord: getSubLord(siderealCusp),
      nakshatra: getNakshatra(siderealCusp),
    });
  }

  // KP planets table — Sign Lord, Star Lord, Sub Lord for each planet
  const kpPlanets = {};
  for (const [name, planet] of Object.entries(planets)) {
    const lon = planet.longitude;

    // Determine which KP house this planet falls in (by Placidus cusp boundaries)
    let kpHouse = 1;
    for (let i = 0; i < 12; i++) {
      const cuspStart = cusps[i].fullDegree;
      const cuspEnd = cusps[(i + 1) % 12].fullDegree;

      if (cuspStart < cuspEnd) {
        if (lon >= cuspStart && lon < cuspEnd) { kpHouse = i + 1; break; }
      } else {
        // Wraps around 360°
        if (lon >= cuspStart || lon < cuspEnd) { kpHouse = i + 1; break; }
      }
    }

    kpPlanets[name] = {
      planet: name,
      sign: planet.sign,
      degree: planet.degree,
      kpHouse,
      signLord: getSignLord(lon),
      starLord: getStarLord(lon),
      subLord: getSubLord(lon),
      nakshatra: planet.nakshatra,
      isRetrograde: planet.isRetrograde,
    };
  }

  // Ruling planets — based on current moment (Ascendant, Moon, Day)
  // For birth chart KP, use the birth ascendant and birth Moon
  const ascLon = cusps[0].fullDegree; // 1st cusp = Ascendant
  const moonLon = planets.Moon.longitude;

  const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon...
  const dayLords = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const dayLord = dayLords[dayOfWeek];

  const rulingPlanets = {
    ascSignLord: getSignLord(ascLon),
    ascStarLord: getStarLord(ascLon),
    ascSubLord: getSubLord(ascLon),
    moonSignLord: getSignLord(moonLon),
    moonStarLord: getStarLord(moonLon),
    moonSubLord: getSubLord(moonLon),
    dayLord,
  };

  return { cusps, kpPlanets, rulingPlanets };
}
