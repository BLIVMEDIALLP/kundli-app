import { PLANET_ORDER } from './constants.js';

const ASHTAKVARGA_TABLES = {
  Sun: {
    Sun: [1,2,4,7,8,9,10,11], Moon: [3,6,10,11], Mars: [1,2,4,7,8,9,10,11],
    Mercury: [3,5,6,9,10,11,12], Jupiter: [5,6,9,11], Venus: [6,7,12],
    Saturn: [1,2,4,7,8,9,10,11], Lagna: [3,4,6,10,11,12],
  },
  Moon: {
    Sun: [3,6,7,8,10,11], Moon: [1,3,6,7,10,11], Mars: [2,3,5,6,9,10,11],
    Mercury: [1,3,4,5,7,8,10,11], Jupiter: [1,4,7,8,10,11], Venus: [3,4,5,7,9,10,11],
    Saturn: [3,5,6,11], Lagna: [3,6,10,11],
  },
  Mars: {
    Sun: [3,5,6,10,11], Moon: [3,6,11], Mars: [1,2,4,7,8,10,11],
    Mercury: [3,5,6,11], Jupiter: [6,10,11,12], Venus: [6,8,11,12],
    Saturn: [1,4,7,8,9,10,11], Lagna: [1,2,4,7,8,9,10,11],
  },
  Mercury: {
    Sun: [5,6,9,11,12], Moon: [2,4,6,8,10,11], Mars: [1,2,4,7,8,9,10,11],
    Mercury: [1,3,5,6,9,10,11,12], Jupiter: [6,8,11,12], Venus: [1,2,3,4,5,8,9,11],
    Saturn: [1,2,4,7,8,9,10,11], Lagna: [1,2,4,6,8,10,11],
  },
  Jupiter: {
    Sun: [1,2,3,4,7,8,9,10,11], Moon: [2,5,7,9,11], Mars: [1,2,4,7,8,10,11],
    Mercury: [1,2,4,5,6,9,10,11], Jupiter: [1,2,3,4,7,8,10,11], Venus: [2,5,6,9,10,11],
    Saturn: [3,5,6,12], Lagna: [1,2,4,5,6,7,9,10,11],
  },
  Venus: {
    Sun: [8,11,12], Moon: [1,2,3,4,5,8,9,11,12], Mars: [3,4,6,9,11,12],
    Mercury: [3,5,6,9,11], Jupiter: [5,8,9,10,11], Venus: [1,2,3,4,5,8,9,10,11],
    Saturn: [3,4,5,8,9,10,11], Lagna: [1,2,3,4,5,8,9,11],
  },
  Saturn: {
    Sun: [1,2,4,7,8,10,11], Moon: [3,6,11], Mars: [3,5,6,10,11,12],
    Mercury: [6,8,9,10,11,12], Jupiter: [5,6,11,12], Venus: [6,11,12],
    Saturn: [3,5,6,11], Lagna: [1,3,4,6,10,11],
  },
};

export function calcAshtakvarga(planets, ascendant) {
  const bhinnashtakvarga = {};
  const sarvashtakvarga = Array(12).fill(0);

  for (const subject of PLANET_ORDER) {
    const table = ASHTAKVARGA_TABLES[subject];
    const points = Array(12).fill(0);

    for (const ref of PLANET_ORDER) {
      const refSignIndex = planets[ref].signIndex;
      const beneficHouses = table[ref] || [];
      for (const h of beneficHouses) {
        const targetSign = (refSignIndex + h - 1) % 12;
        points[targetSign] += 1;
      }
    }

    const lagnaSignIndex = ascendant.signIndex;
    const lagnaHouses = table['Lagna'] || [];
    for (const h of lagnaHouses) {
      const targetSign = (lagnaSignIndex + h - 1) % 12;
      points[targetSign] += 1;
    }

    bhinnashtakvarga[subject] = points;
    for (let i = 0; i < 12; i++) sarvashtakvarga[i] += points[i];
  }

  const planetScores = {};
  for (const subject of PLANET_ORDER) {
    planetScores[subject] = bhinnashtakvarga[subject][planets[subject].signIndex];
  }

  return { bhinnashtakvarga, sarvashtakvarga, planetScores };
}
