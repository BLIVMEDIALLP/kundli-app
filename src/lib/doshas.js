export function checkDoshas(planets, houses, ascendant) {
  const doshas = [];

  // 1. Mangal Dosha
  const marsHouseFromLagna = houses.planetHouses['Mars'];
  const mangalHouses = [1, 2, 4, 7, 8, 12];
  const hasMangalFromLagna = mangalHouses.includes(marsHouseFromLagna);

  const moonSignIndex = planets.Moon.signIndex;
  const marsSignIndex = planets.Mars.signIndex;
  const marsHouseFromMoon = ((marsSignIndex - moonSignIndex + 12) % 12) + 1;
  const hasMangalFromMoon = mangalHouses.includes(marsHouseFromMoon);

  const venusSignIndex = planets.Venus.signIndex;
  const marsHouseFromVenus = ((marsSignIndex - venusSignIndex + 12) % 12) + 1;
  const hasMangalFromVenus = mangalHouses.includes(marsHouseFromVenus);

  if (hasMangalFromLagna || hasMangalFromMoon || hasMangalFromVenus) {
    const sources = [];
    if (hasMangalFromLagna) sources.push(`Lagna (House ${marsHouseFromLagna})`);
    if (hasMangalFromMoon) sources.push(`Moon (House ${marsHouseFromMoon})`);
    if (hasMangalFromVenus) sources.push(`Venus (House ${marsHouseFromVenus})`);
    doshas.push({
      name: 'Mangal Dosha (Kuja Dosha)', present: true,
      severity: sources.length >= 2 ? 'High' : 'Moderate',
      description: `Mars is in a sensitive position from ${sources.join(', ')}, affecting marital harmony.`,
      remedy: 'Wearing a red coral gemstone, Mangal Yantra, or performing Kuja Shanti puja may help.',
    });
  }

  // 2. Kaal Sarp Dosha
  const rahuLong = planets.Rahu.longitude;
  const ketuLong = planets.Ketu.longitude;
  const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  let allBetweenRahuKetu = true;
  let allBetweenKetuRahu = true;

  for (const p of planetNames) {
    const pLong = planets[p].longitude;
    if (!isBetween(rahuLong, ketuLong, pLong)) allBetweenRahuKetu = false;
    if (!isBetween(ketuLong, rahuLong, pLong)) allBetweenKetuRahu = false;
  }

  if (allBetweenRahuKetu || allBetweenKetuRahu) {
    doshas.push({
      name: 'Kaal Sarp Dosha', present: true, severity: 'High',
      description: 'All planets are hemmed between Rahu and Ketu, indicating karmic challenges and delays.',
      remedy: 'Performing Kaal Sarp Shanti Puja at temples like Trimbakeshwar is recommended.',
    });
  }

  // 3. Shrapit Dosha
  if (planets.Saturn.signIndex === planets.Rahu.signIndex) {
    doshas.push({
      name: 'Shrapit Dosha', present: true, severity: 'Moderate',
      description: 'Saturn and Rahu are conjunct, indicating past-life karmic debts.',
      remedy: 'Regular worship of Lord Shiva and chanting Maha Mrityunjaya Mantra.',
    });
  }

  // 4. Guru Chandal Dosha
  if (planets.Jupiter.signIndex === planets.Rahu.signIndex || planets.Jupiter.signIndex === planets.Ketu.signIndex) {
    const with_ = planets.Jupiter.signIndex === planets.Rahu.signIndex ? 'Rahu' : 'Ketu';
    doshas.push({
      name: 'Guru Chandal Dosha', present: true, severity: 'Moderate',
      description: `Jupiter is conjunct ${with_}, potentially clouding wisdom and creating ethical dilemmas.`,
      remedy: 'Donating yellow items on Thursdays and chanting Guru Beej Mantra.',
    });
  }

  // 5. Pitru Dosha
  if (houses.planetHouses['Sun'] === 9 && (houses.planetHouses['Rahu'] === 9 || houses.planetHouses['Ketu'] === 9)) {
    doshas.push({
      name: 'Pitru Dosha', present: true, severity: 'Moderate',
      description: 'Sun with Rahu/Ketu in the 9th house indicates ancestral karmic issues.',
      remedy: 'Performing Pitru Tarpan and Shraddha ceremonies regularly.',
    });
  }

  return doshas;
}

function isBetween(start, end, point) {
  if (start < end) return point > start && point < end;
  return point > start || point < end;
}
