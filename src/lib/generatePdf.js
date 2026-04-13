import { jsPDF } from 'jspdf';

const PLANET_SHORT = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
};

const SIGN_ORDER = [
  'Pisces','Aries','Taurus','Gemini','Cancer','Leo',
  'Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius',
];

const SIGN_SHORT = {
  Pisces:'Pis', Aries:'Ari', Taurus:'Tau', Gemini:'Gem',
  Cancer:'Can', Leo:'Leo', Virgo:'Vir', Libra:'Lib',
  Scorpio:'Sco', Sagittarius:'Sag', Capricorn:'Cap', Aquarius:'Aqu',
};

// North Indian chart layout: house positions in 4x4 grid
// [col, row] — 0-indexed
const NI_POSITIONS = {
  12:[0,0], 1:[1,0], 2:[2,0], 3:[3,0],
  11:[0,1],                   4:[3,1],
  10:[0,2],                   5:[3,2],
   9:[0,3], 8:[1,3], 7:[2,3], 6:[3,3],
};

// South Indian sign grid positions [col, row] — 0-indexed
const SI_POSITIONS = {
  Pisces:[0,0], Aries:[1,0], Taurus:[2,0], Gemini:[3,0],
  Cancer:[3,1],                              Leo:[3,2],
  Virgo:[3,3], Libra:[2,3], Scorpio:[1,3], Sagittarius:[0,3],
  Capricorn:[0,2],                           Aquarius:[0,1],
};

function drawNorthIndianChart(doc, housePlacements, retrogradeMap, x, y, size, title) {
  const cell = size / 4;

  // Title
  doc.setFontSize(7);
  doc.setTextColor(154, 120, 48);
  doc.text(title.toUpperCase(), x + size / 2, y - 3, { align: 'center' });

  // Outer border
  doc.setDrawColor(200, 160, 48);
  doc.setLineWidth(0.8);
  doc.rect(x, y, size, size);

  // Draw all house cells
  for (const [houseStr, [col, row]] of Object.entries(NI_POSITIONS)) {
    const house = parseInt(houseStr);
    const cx = x + col * cell;
    const cy = y + row * cell;
    doc.setLineWidth(0.4);
    doc.setDrawColor(200, 160, 48);
    doc.setFillColor(248, 242, 222);
    doc.rect(cx, cy, cell, cell, 'FD');

    const hp = housePlacements?.find(h => h.house === house);
    if (!hp) continue;

    // House number
    doc.setFontSize(5);
    doc.setTextColor(150, 150, 150);
    doc.text(String(house), cx + 1.5, cy + 4);

    // Sign
    doc.setFontSize(5.5);
    doc.setTextColor(100, 80, 30);
    doc.text(hp.sign ? hp.sign.slice(0, 3) : '', cx + cell / 2, cy + 8, { align: 'center' });

    // Lagna label
    if (house === 1) {
      doc.setFontSize(5);
      doc.setTextColor(180, 140, 20);
      doc.text('Lag', cx + cell / 2, cy + 12, { align: 'center' });
    }

    // Planets
    const planets = hp.planets || [];
    doc.setFontSize(5.5);
    planets.forEach((p, i) => {
      doc.setTextColor(80, 80, 80);
      const label = (PLANET_SHORT[p] || p.slice(0, 2)) + (retrogradeMap?.[p] ? 'R' : '');
      doc.text(label, cx + cell / 2, cy + 14 + i * 4, { align: 'center' });
    });
  }

  // Center box (2x2)
  doc.setFillColor(253, 245, 216);
  doc.setDrawColor(200, 160, 48);
  doc.setLineWidth(0.4);
  doc.rect(x + cell, y + cell, cell * 2, cell * 2, 'FD');
  doc.setFontSize(10);
  doc.setTextColor(200, 160, 48);
  doc.text('✦', x + size / 2, y + size / 2 + 2, { align: 'center' });
}

function drawSouthIndianChart(doc, planets, ascendantSign, retrogradeMap, x, y, size, title) {
  const cell = size / 4;

  // Title
  doc.setFontSize(7);
  doc.setTextColor(154, 120, 48);
  doc.text(title.toUpperCase(), x + size / 2, y - 3, { align: 'center' });

  // Outer border
  doc.setDrawColor(200, 160, 48);
  doc.setLineWidth(0.8);
  doc.rect(x, y, size, size);

  // Build signPlanets map
  const signPlanets = {};
  for (const [name, data] of Object.entries(planets || {})) {
    if (!signPlanets[data.sign]) signPlanets[data.sign] = [];
    signPlanets[data.sign].push(name);
  }

  const ascIdx = SIGN_ORDER.indexOf(ascendantSign);

  for (const [sign, [col, row]] of Object.entries(SI_POSITIONS)) {
    const cx = x + col * cell;
    const cy = y + row * cell;
    const isAsc = sign === ascendantSign;
    const idx = SIGN_ORDER.indexOf(sign);
    const house = (ascIdx !== -1 && idx !== -1) ? ((idx - ascIdx + 12) % 12) + 1 : null;

    doc.setLineWidth(0.4);
    doc.setDrawColor(200, 160, 48);
    doc.setFillColor(isAsc ? 253 : 248, isAsc ? 245 : 242, isAsc ? 216 : 222);
    doc.rect(cx, cy, cell, cell, 'FD');

    // Sign abbrev
    doc.setFontSize(5.5);
    doc.setTextColor(100, 80, 30);
    doc.text(SIGN_SHORT[sign] || sign.slice(0, 3), cx + 2, cy + 5);

    // House number
    if (house) {
      doc.setFontSize(5);
      doc.setTextColor(150, 150, 150);
      doc.text(String(house), cx + cell - 4, cy + 5);
    }

    // Asc label
    if (isAsc) {
      doc.setFontSize(5);
      doc.setTextColor(180, 140, 20);
      doc.text('Asc', cx + cell / 2, cy + 10, { align: 'center' });
    }

    // Planets
    const planetsInSign = signPlanets[sign] || [];
    doc.setFontSize(5.5);
    planetsInSign.forEach((p, i) => {
      doc.setTextColor(80, 80, 80);
      const label = (PLANET_SHORT[p] || p.slice(0, 2)) + (retrogradeMap?.[p] ? 'R' : '');
      doc.text(label, cx + cell / 2, cy + (isAsc ? 14 : 10) + i * 4, { align: 'center' });
    });
  }

  // Center 2x2 blank
  doc.setFillColor(248, 242, 222);
  doc.setDrawColor(200, 160, 48);
  doc.setLineWidth(0.4);
  doc.rect(x + cell, y + cell, cell * 2, cell * 2, 'FD');
  doc.setFontSize(10);
  doc.setTextColor(200, 160, 48);
  doc.text('✦', x + size / 2, y + size / 2 + 2, { align: 'center' });
}

export async function downloadKundliPdf(data) {
  const { report, kp, planets: rawPlanets } = data;
  if (!report) return;

  const {
    summary, housePlacements, planetaryStrengths,
    currentDasha, dashaTimeline, doshas, navamsha,
  } = report;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, H = 297, M = 14;

  const retrogradeMap = rawPlanets
    ? Object.fromEntries(Object.entries(rawPlanets).map(([n, p]) => [n, p.isRetrograde]))
    : {};

  // Bhav Chalit house placements
  const bhavChality = kp ? (() => {
    const houses = Array.from({ length: 12 }, (_, i) => ({
      house: i + 1, sign: kp.cusps[i]?.sign || '', lord: '', planets: [],
    }));
    for (const [name, planet] of Object.entries(kp.kpPlanets)) {
      const h = planet.kpHouse;
      if (h >= 1 && h <= 12) houses[h - 1].planets.push(name);
    }
    return houses;
  })() : null;

  // Bhav Chalit planets for South Indian
  const bhavChalitPlanetsForSouth = kp ? (() => {
    const result = {};
    for (const [name, kpPlanet] of Object.entries(kp.kpPlanets)) {
      const houseSign = kp.cusps[kpPlanet.kpHouse - 1]?.sign || (rawPlanets?.[name]?.sign ?? '');
      result[name] = { ...(rawPlanets?.[name] || {}), sign: houseSign };
    }
    return result;
  })() : null;

  // ─── PAGE 1: Header + Charts ────────────────────────────────────────────────
  // Gold header band
  doc.setFillColor(154, 120, 48);
  doc.rect(0, 0, W, 22, 'F');
  doc.setFontSize(18);
  doc.setTextColor(255, 240, 200);
  doc.text('Kundli — Vedic Birth Chart', W / 2, 10, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(230, 210, 160);
  doc.text('Vedic Astrology & Astrological Analysis', W / 2, 17, { align: 'center' });

  // Birth summary boxes
  let gy = 28;
  const boxes = [
    ['Name', summary.name],
    ['Date of Birth', summary.dateOfBirth],
    ['Time of Birth', summary.timeOfBirth],
    ['Place of Birth', summary.placeOfBirth],
    ['Ascendant (Lagna)', `${summary.ascendant} (${summary.ascendantLord})`],
    ['Moon Sign (Rashi)', `${summary.moonSign} (${summary.rashiLord})`],
    ['Sun Sign', summary.sunSign],
    ['Birth Nakshatra', `${summary.birthNakshatra} Pada ${summary.nakshatraPada}`],
    ['Nakshatra Lord', summary.nakshatraLord],
    ['Gender', data.gender || ''],
  ];
  const bW = (W - M * 2 - 4) / 2;
  boxes.forEach(([label, val], i) => {
    const bx = M + (i % 2) * (bW + 4);
    const by = gy + Math.floor(i / 2) * 10;
    doc.setFillColor(30, 30, 40);
    doc.setDrawColor(80, 80, 100);
    doc.setLineWidth(0.3);
    doc.rect(bx, by, bW, 9, 'FD');
    doc.setFontSize(5.5);
    doc.setTextColor(120, 120, 150);
    doc.text(label.toUpperCase(), bx + 2, by + 3.5);
    doc.setFontSize(7);
    doc.setTextColor(230, 210, 160);
    doc.text(String(val || ''), bx + 2, by + 7.5);
  });

  gy += Math.ceil(boxes.length / 2) * 10 + 6;

  // North Indian charts side by side
  doc.setFontSize(7);
  doc.setTextColor(154, 120, 48);
  doc.text('NORTH INDIAN STYLE', M, gy);
  gy += 4;

  const chartSize = 70;
  drawNorthIndianChart(doc, housePlacements, retrogradeMap, M, gy, chartSize, 'Lagna Chart');
  if (bhavChality) {
    drawNorthIndianChart(doc, bhavChality, retrogradeMap, M + chartSize + 8, gy, chartSize, 'Bhav Chalit');
  }
  gy += chartSize + 8;

  // South Indian charts
  doc.setFontSize(7);
  doc.setTextColor(154, 120, 48);
  doc.text('SOUTH INDIAN STYLE', M, gy);
  gy += 4;

  drawSouthIndianChart(doc, rawPlanets, summary.ascendant, retrogradeMap, M, gy, chartSize, 'Lagna Chart');
  if (bhavChalitPlanetsForSouth) {
    drawSouthIndianChart(doc, bhavChalitPlanetsForSouth, summary.ascendant, retrogradeMap, M + chartSize + 8, gy, chartSize, 'Bhav Chalit');
  }

  // ─── PAGE 2: Planets + Houses ───────────────────────────────────────────────
  doc.addPage();
  let py = M;

  // Section header helper
  const sectionHeader = (title, y) => {
    doc.setFillColor(40, 30, 10);
    doc.rect(M, y, W - M * 2, 7, 'F');
    doc.setFontSize(8);
    doc.setTextColor(200, 160, 48);
    doc.text(title, M + 3, y + 5);
    return y + 10;
  };

  py = sectionHeader('Planetary Positions', py);
  const planetCols = ['Planet', 'Sign', 'House', 'Degree', 'Nakshatra', 'Pada', 'Retro'];
  const planetColW = [22, 20, 15, 18, 30, 12, 12];
  // Header row
  doc.setFillColor(60, 50, 20);
  doc.rect(M, py, W - M * 2, 6, 'F');
  doc.setFontSize(6);
  doc.setTextColor(200, 160, 48);
  let cx2 = M;
  planetCols.forEach((col, i) => {
    doc.text(col, cx2 + 1, py + 4);
    cx2 += planetColW[i];
  });
  py += 6;

  planetaryStrengths.forEach((p, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 25 : 30, idx % 2 === 0 ? 25 : 28, idx % 2 === 0 ? 35 : 38);
    doc.rect(M, py, W - M * 2, 5.5, 'F');
    doc.setFontSize(6);
    doc.setTextColor(220, 210, 190);
    cx2 = M;
    const row = [
      p.planet, p.sign, String(p.house), `${p.degree?.toFixed(1)}°`,
      p.nakshatra, String(p.pada), p.isRetrograde ? 'R' : '',
    ];
    row.forEach((val, i) => {
      doc.text(String(val || ''), cx2 + 1, py + 4);
      cx2 += planetColW[i];
    });
    py += 5.5;
  });

  py += 8;
  py = sectionHeader('House Placements (Whole Sign)', py);

  const houseCols = ['House', 'Sign', 'Lord', 'Planets'];
  const houseColW = [18, 25, 20, 100];
  doc.setFillColor(60, 50, 20);
  doc.rect(M, py, W - M * 2, 6, 'F');
  doc.setFontSize(6);
  doc.setTextColor(200, 160, 48);
  cx2 = M;
  houseCols.forEach((col, i) => {
    doc.text(col, cx2 + 1, py + 4);
    cx2 += houseColW[i];
  });
  py += 6;

  housePlacements.forEach((h, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 25 : 30, idx % 2 === 0 ? 25 : 28, idx % 2 === 0 ? 35 : 38);
    doc.rect(M, py, W - M * 2, 5.5, 'F');
    doc.setFontSize(6);
    doc.setTextColor(220, 210, 190);
    cx2 = M;
    const row = [
      `House ${h.house}`, h.sign, h.lord, h.planets.join(', '),
    ];
    row.forEach((val, i) => {
      doc.text(String(val || ''), cx2 + 1, py + 4);
      cx2 += houseColW[i];
    });
    py += 5.5;
  });

  // ─── PAGE 3: KP + Dasha ─────────────────────────────────────────────────────
  if (kp) {
    doc.addPage();
    py = M;

    py = sectionHeader('KP Ruling Planets', py);
    const rpCards = [
      ['Ascendant', kp.rulingPlanets.ascSignLord, kp.rulingPlanets.ascStarLord, kp.rulingPlanets.ascSubLord],
      ['Moon', kp.rulingPlanets.moonSignLord, kp.rulingPlanets.moonStarLord, kp.rulingPlanets.moonSubLord],
    ];
    rpCards.forEach((card, ci) => {
      const cardX = M + ci * 90;
      doc.setFillColor(35, 28, 10);
      doc.setDrawColor(100, 80, 30);
      doc.setLineWidth(0.3);
      doc.rect(cardX, py, 85, 18, 'FD');
      doc.setFontSize(6.5);
      doc.setTextColor(200, 160, 48);
      doc.text(card[0], cardX + 3, py + 5);
      doc.setFontSize(6);
      doc.setTextColor(200, 200, 200);
      doc.text(`Sign Lord: ${card[1]}  Star Lord: ${card[2]}  Sub Lord: ${card[3]}`, cardX + 3, py + 12);
    });
    py += 22;

    py = sectionHeader('KP Planets', py);
    const kpCols = ['Planet', 'Sign', 'Deg', 'KP House', 'Nakshatra', 'Sign Lord', 'Star Lord', 'Sub Lord'];
    const kpColW = [20, 20, 16, 18, 28, 22, 22, 22];
    doc.setFillColor(60, 50, 20);
    doc.rect(M, py, W - M * 2, 6, 'F');
    doc.setFontSize(6);
    doc.setTextColor(200, 160, 48);
    cx2 = M;
    kpCols.forEach((col, i) => { doc.text(col, cx2 + 1, py + 4); cx2 += kpColW[i]; });
    py += 6;

    Object.values(kp.kpPlanets).forEach((p, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 25 : 30, idx % 2 === 0 ? 25 : 28, idx % 2 === 0 ? 35 : 38);
      doc.rect(M, py, W - M * 2, 5.5, 'F');
      doc.setFontSize(6);
      doc.setTextColor(220, 210, 190);
      cx2 = M;
      [p.planet + (p.isRetrograde ? ' R' : ''), p.sign, `${p.degree?.toFixed(1)}°`,
       String(p.kpHouse), p.nakshatra, p.signLord, p.starLord, p.subLord
      ].forEach((val, i) => { doc.text(String(val || ''), cx2 + 1, py + 4); cx2 += kpColW[i]; });
      py += 5.5;
    });

    py += 8;
    py = sectionHeader('Vimshottari Dasha Timeline', py);

    if (currentDasha) {
      doc.setFillColor(50, 35, 10);
      doc.rect(M, py, W - M * 2, 14, 'F');
      doc.setFontSize(8);
      doc.setTextColor(200, 160, 48);
      doc.text(`${currentDasha.mahadasha} Mahadasha — ${currentDasha.antardasha || ''} Antardasha`, M + 3, py + 6);
      doc.setFontSize(6.5);
      doc.setTextColor(180, 180, 180);
      doc.text(`${currentDasha.mahaStart} → ${currentDasha.mahaEnd}${currentDasha.antarEnd ? ` · Antar ends: ${currentDasha.antarEnd}` : ''}`, M + 3, py + 11);
      py += 18;
    }

    dashaTimeline?.slice(0, 9).forEach((d, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 25 : 30, idx % 2 === 0 ? 25 : 28, idx % 2 === 0 ? 35 : 38);
      doc.rect(M, py, W - M * 2, 5.5, 'F');
      doc.setFontSize(6);
      doc.setTextColor(220, 210, 190);
      doc.text(`${d.lord}`, M + 3, py + 4);
      doc.text(`${d.start} → ${d.end}`, M + 40, py + 4);
      doc.text(`${d.years?.toFixed(1)}y`, M + 110, py + 4);
      py += 5.5;
    });
  }

  // ─── PAGE 4: Doshas + Navamsha ───────────────────────────────────────────────
  doc.addPage();
  py = M;

  py = sectionHeader('Doshas & Afflictions', py);
  doshas?.forEach((d, idx) => {
    if (!d.present) return;
    doc.setFillColor(60, 20, 20);
    doc.setDrawColor(150, 50, 50);
    doc.setLineWidth(0.3);
    doc.rect(M, py, W - M * 2, 18, 'FD');
    doc.setFontSize(7.5);
    doc.setTextColor(220, 100, 100);
    doc.text(`${d.name} — ${d.severity}`, M + 3, py + 6);
    doc.setFontSize(6);
    doc.setTextColor(200, 180, 180);
    const descLines = doc.splitTextToSize(d.description || '', W - M * 2 - 6);
    doc.text(descLines[0] || '', M + 3, py + 11);
    if (d.remedy) {
      doc.setTextColor(200, 160, 48);
      doc.text(`Remedy: ${d.remedy}`.substring(0, 90), M + 3, py + 16);
    }
    py += 22;
  });

  py += 4;
  py = sectionHeader('Navamsha Chart (D9)', py);
  const navCols = ['Planet', 'Navamsha Sign', 'Sign Lord'];
  const navColW = [40, 60, 60];
  doc.setFillColor(60, 50, 20);
  doc.rect(M, py, W - M * 2, 6, 'F');
  doc.setFontSize(6);
  doc.setTextColor(200, 160, 48);
  cx2 = M;
  navCols.forEach((col, i) => { doc.text(col, cx2 + 1, py + 4); cx2 += navColW[i]; });
  py += 6;

  navamsha?.forEach((n, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 25 : 30, idx % 2 === 0 ? 25 : 28, idx % 2 === 0 ? 35 : 38);
    doc.rect(M, py, W - M * 2, 5.5, 'F');
    doc.setFontSize(6);
    doc.setTextColor(220, 210, 190);
    cx2 = M;
    [n.planet, n.navamshaSign, n.lord].forEach((val, i) => {
      doc.text(String(val || ''), cx2 + 1, py + 4);
      cx2 += navColW[i];
    });
    py += 5.5;
  });

  // Save
  const safeName = (summary.name || 'Kundli').replace(/[^a-zA-Z0-9_]/g, '_');
  doc.save(`Kundli_${safeName}_${summary.dateOfBirth}.pdf`);
}
