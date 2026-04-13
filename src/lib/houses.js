import { SIGNS, SIGN_LORDS } from './constants.js';

export function assignHouses(ascendant, planets) {
  const lagnaSignIndex = ascendant.signIndex;

  const houseToSign = {};
  const signToHouse = {};
  for (let h = 1; h <= 12; h++) {
    const signIndex = (lagnaSignIndex + h - 1) % 12;
    houseToSign[h] = { house: h, sign: SIGNS[signIndex], signIndex, lord: SIGN_LORDS[SIGNS[signIndex]] };
    signToHouse[signIndex] = h;
  }

  const planetHouses = {};
  for (const [name, planet] of Object.entries(planets)) {
    planetHouses[name] = signToHouse[planet.signIndex];
  }

  const housePlanets = {};
  for (let h = 1; h <= 12; h++) housePlanets[h] = [];
  for (const [name, house] of Object.entries(planetHouses)) {
    housePlanets[house].push(name);
  }

  return { houseToSign, signToHouse, planetHouses, housePlanets, lagnaSignIndex };
}
