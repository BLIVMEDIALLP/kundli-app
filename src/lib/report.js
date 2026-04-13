import { SIGN_DESCRIPTIONS, NAKSHATRA_DESCRIPTIONS, HOUSE_MEANINGS } from './constants.js';

export function generateReport({ name, gender, dateOfBirth, timeOfBirth, placeOfBirth, planets, ascendant, houses, dasha, ashtakvarga, divisional, doshas }) {
  const moonSign = planets.Moon.sign;
  const sunSign = planets.Sun.sign;
  const birthNakshatra = planets.Moon.nakshatra;
  const ascSign = ascendant.sign;

  return {
    summary: {
      name, gender, dateOfBirth, timeOfBirth, placeOfBirth,
      ascendant: ascSign, ascendantLord: ascendant.signLord,
      moonSign, sunSign, birthNakshatra,
      nakshatraPada: planets.Moon.pada,
      nakshatraLord: planets.Moon.nakshatraLord,
      rashi: moonSign, rashiLord: planets.Moon.signLord,
    },
    ascendantInterpretation: {
      sign: ascSign, ...SIGN_DESCRIPTIONS[ascSign],
      interpretation: `With ${ascSign} rising, ${SIGN_DESCRIPTIONS[ascSign]?.desc || ''} The ascendant lord ${ascendant.signLord} shapes your overall life path and physical constitution.`,
    },
    moonSignInterpretation: {
      sign: moonSign, ...SIGN_DESCRIPTIONS[moonSign],
      interpretation: `Moon in ${moonSign} reflects your emotional nature and subconscious patterns. ${SIGN_DESCRIPTIONS[moonSign]?.desc || ''}`,
    },
    nakshatraInterpretation: {
      nakshatra: birthNakshatra, pada: planets.Moon.pada, lord: planets.Moon.nakshatraLord,
      interpretation: NAKSHATRA_DESCRIPTIONS[birthNakshatra] || 'A powerful birth star with unique qualities.',
    },
    housePlacements: Object.entries(houses.housePlanets).map(([house, planetsInHouse]) => ({
      house: parseInt(house), sign: houses.houseToSign[house].sign,
      lord: houses.houseToSign[house].lord, planets: planetsInHouse, meaning: HOUSE_MEANINGS[house],
    })),
    planetaryStrengths: Object.entries(planets).map(([pName, p]) => {
      const score = ashtakvarga.planetScores?.[pName] ?? null;
      return {
        planet: pName, sign: p.sign, house: houses.planetHouses[pName],
        degree: p.degree, nakshatra: p.nakshatra, pada: p.pada,
        isRetrograde: p.isRetrograde, ashtakavargaScore: score,
        strength: score !== null ? (score >= 5 ? 'Strong' : score >= 3 ? 'Moderate' : 'Weak') : null,
      };
    }),
    currentDasha: dasha.current ? {
      mahadasha: dasha.current.mahadasha, antardasha: dasha.current.antardasha,
      mahaStart: dasha.current.mahaStart, mahaEnd: dasha.current.mahaEnd,
      antarStart: dasha.current.antarStart, antarEnd: dasha.current.antarEnd,
      interpretation: `You are currently in the ${dasha.current.mahadasha} Mahadasha${dasha.current.antardasha ? `, ${dasha.current.antardasha} Antardasha` : ''}. This period activates the themes of ${dasha.current.mahadasha} in your life.`,
    } : null,
    dashaTimeline: dasha.timeline,
    doshas: doshas.length > 0 ? doshas : [{
      name: 'No major doshas detected', present: false, severity: 'None',
      description: 'Your chart is relatively free of major planetary afflictions.',
    }],
    navamsha: Object.entries(divisional.D9).map(([planet, pos]) => ({
      planet, navamshaSign: pos.sign, lord: pos.lord,
    })),
  };
}
