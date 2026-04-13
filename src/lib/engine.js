// Swiss Ephemeris WASM engine
// Replaces native C binding with WebAssembly — works in browser + serverless
import SwissEph from 'swisseph-wasm';
import { SIGNS, SIGN_LORDS, NAKSHATRAS, NAKSHATRA_LORDS, NAKSHATRA_SPAN } from './constants.js';

let swe = null;
let initialized = false;

export async function initEngine() {
  if (initialized && swe) return swe;
  swe = new SwissEph();
  await swe.initSwissEph();

  // Patch: library allocates only 4 doubles but swe_calc_ut writes 6 (lon, lat, dist, speedLon, speedLat, speedDist)
  const module = swe.SweModule;
  swe.calc_ut = (julianDay, body, flags) => {
    const buffer = module._malloc(6 * Float64Array.BYTES_PER_ELEMENT);
    module.ccall('swe_calc_ut', 'number', ['number', 'number', 'number', 'pointer'], [julianDay, body, flags, buffer]);
    const view = new Float64Array(module.HEAPF64.buffer, buffer, 6);
    const result = Array.from(view);
    module._free(buffer);
    return result;
  };

  // Set Lahiri ayanamsha — standard for Vedic/Indian Jyotish
  swe.set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
  initialized = true;
  return swe;
}

export function destroyEngine() {
  if (swe) {
    swe.close();
    swe = null;
    initialized = false;
  }
}

const PLANET_IDS_MAP = {
  Sun: 0,       // SE_SUN
  Moon: 1,      // SE_MOON
  Mercury: 2,   // SE_MERCURY
  Venus: 3,     // SE_VENUS
  Mars: 4,      // SE_MARS
  Jupiter: 5,   // SE_JUPITER
  Saturn: 6,    // SE_SATURN
  Rahu: 10,     // SE_MEAN_NODE
};

function getLongitudeDetails(longitude) {
  const signIndex = Math.floor(longitude / 30);
  const degree = longitude % 30;
  const nakshatraIndex = Math.floor(longitude / NAKSHATRA_SPAN);
  const posInNakshatra = longitude % NAKSHATRA_SPAN;
  const pada = Math.floor(posInNakshatra / (NAKSHATRA_SPAN / 4)) + 1;

  return {
    longitude,
    sign: SIGNS[signIndex],
    signIndex,
    degree: parseFloat(degree.toFixed(4)),
    nakshatra: NAKSHATRAS[nakshatraIndex],
    nakshatraIndex,
    nakshatraLord: NAKSHATRA_LORDS[nakshatraIndex],
    pada,
  };
}

export function getJulianDay(year, month, day, hour, minute, second, timezone) {
  const utcHour = hour + minute / 60 + (second || 0) / 3600 - timezone;
  return swe.julday(year, month, day, utcHour);
}

export function getPlanetaryPositions(jd) {
  const flags = 65536 | 4 | 256; // SEFLG_SIDEREAL | SEFLG_MOSEPH (built-in, no data files needed) | SEFLG_SPEED
  const positions = {};

  for (const [name, id] of Object.entries(PLANET_IDS_MAP)) {
    const result = swe.calc_ut(jd, id, flags);
    // result is array: [longitude, latitude, distance, speedLong, speedLat, speedDist]
    if (!result || result.length < 4) {
      throw new Error(`Swiss Ephemeris error for ${name}`);
    }
    const lon = result[0];
    positions[name] = {
      ...getLongitudeDetails(lon),
      isRetrograde: result[3] < 0,
      signLord: SIGN_LORDS[SIGNS[Math.floor(lon / 30)]],
    };
  }

  // Ketu = 180° opposite Rahu
  const ketuLon = (positions.Rahu.longitude + 180) % 360;
  positions.Ketu = {
    ...getLongitudeDetails(ketuLon),
    isRetrograde: false,
    signLord: SIGN_LORDS[SIGNS[Math.floor(ketuLon / 30)]],
  };

  return positions;
}

export function getAscendant(jd, lat, lon) {
  // Patch: swe.houses() wrapper doesn't allocate output buffers — call WASM directly
  // swe_houses(tjd, geolat, geolon, hsys, cusps[13], ascmc[10])
  const module = swe.SweModule;
  const cuspsPtr = module._malloc(13 * Float64Array.BYTES_PER_ELEMENT);
  const ascmcPtr = module._malloc(10 * Float64Array.BYTES_PER_ELEMENT);
  module.ccall(
    'swe_houses', 'number',
    ['number', 'number', 'number', 'number', 'pointer', 'pointer'],
    [jd, lat, lon, 'P'.charCodeAt(0), cuspsPtr, ascmcPtr]
  );
  const ascmcView = new Float64Array(module.HEAPF64.buffer, ascmcPtr, 10);
  const tropicalAsc = ascmcView[0]; // ascmc[0] = Ascendant
  module._free(cuspsPtr);
  module._free(ascmcPtr);

  const ayanamsha = swe.get_ayanamsa_ut(jd);
  const siderealAsc = ((tropicalAsc - ayanamsha) % 360 + 360) % 360;

  return {
    ...getLongitudeDetails(siderealAsc),
    signLord: SIGN_LORDS[SIGNS[Math.floor(siderealAsc / 30)]],
  };
}
