// Master calculator — single entry point
import { initEngine, destroyEngine, getJulianDay, getPlanetaryPositions, getAscendant } from './engine.js';
import { assignHouses } from './houses.js';
import { calcVimshottariDasha } from './dasha.js';
import { calcAshtakvarga } from './ashtakvarga.js';
import { calcDivisionalCharts } from './divisional.js';
import { checkDoshas } from './doshas.js';
import { generateReport } from './report.js';
import { calcKPSystem } from './kp.js';

export async function calculateKundli({ name, gender, dateOfBirth, timeOfBirth, placeOfBirth, latitude, longitude, timezone }) {
  const swe = await initEngine();

  const [year, month, day] = dateOfBirth.split('-').map(Number);
  const [hour, minute] = timeOfBirth.split(':').map(Number);

  const jd = getJulianDay(year, month, day, hour, minute, 0, timezone);
  const planets = getPlanetaryPositions(jd);
  const ascendant = getAscendant(jd, latitude, longitude);

  const houses = assignHouses(ascendant, planets);
  const dasha = calcVimshottariDasha(planets.Moon, dateOfBirth);
  const ashtakvarga = calcAshtakvarga(planets, ascendant);
  const divisional = calcDivisionalCharts(planets);
  const doshas = checkDoshas(planets, houses, ascendant);
  const kp = calcKPSystem(swe, jd, latitude, longitude, planets);

  const report = generateReport({
    name, gender, dateOfBirth, timeOfBirth, placeOfBirth,
    planets, ascendant, houses, dasha, ashtakvarga, divisional, doshas,
  });

  return { planets, ascendant, houses, dasha, ashtakvarga, divisional, doshas, kp, report, name, gender, placeOfBirth };
}
