// South Indian Kundli Chart
// Signs are FIXED in position. Planets placed in their sign's cell.
// Houses counted clockwise from Ascendant sign.

const PLANET_SHORT = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
};

const PLANET_COLOR = {
  Sun: '#c85010', Moon: '#2050c0', Mars: '#c02020', Mercury: '#1a7a48',
  Jupiter: '#9a7010', Venus: '#b02888', Saturn: '#3a5070',
  Rahu: '#a05020', Ketu: '#5a2880',
};

const SIGN_GRID = {
  Pisces:      [1, 1], Aries:       [2, 1], Taurus:      [3, 1], Gemini:      [4, 1],
  Cancer:      [4, 2],                                             Leo:         [4, 3],
  Virgo:       [4, 4], Libra:       [3, 4], Scorpio:     [2, 4], Sagittarius: [1, 4],
  Capricorn:   [1, 3],                                             Aquarius:    [1, 2],
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

export default function SouthIndianChart({ planets, ascendantSign, title, retrogradeMap, degreeMap }) {
  const signPlanets = {};
  for (const [name, data] of Object.entries(planets || {})) {
    if (!signPlanets[data.sign]) signPlanets[data.sign] = [];
    signPlanets[data.sign].push(name);
  }

  const ascIdx = SIGN_ORDER.indexOf(ascendantSign);
  const houseOf = (sign) => {
    const idx = SIGN_ORDER.indexOf(sign);
    if (idx === -1 || ascIdx === -1) return null;
    return ((idx - ascIdx + 12) % 12) + 1;
  };

  return (
    <div className="si-wrap">
      <div className="si-title">{title}</div>
      <div className="si-grid">
        {Object.entries(SIGN_GRID).map(([sign, [col, row]]) => {
          const isAsc = sign === ascendantSign;
          const house = houseOf(sign);
          const planetsInSign = signPlanets[sign] || [];
          return (
            <div
              key={sign}
              className={`si-cell${isAsc ? ' si-cell-asc' : ''}`}
              style={{ gridColumn: col, gridRow: row }}
            >
              <span className="si-sign">{SIGN_SHORT[sign]}</span>
              {house && <span className="si-house">{house}</span>}
              <div className="si-planets-wrap">
                {isAsc && <span className="si-asc-label">Asc</span>}
                {planetsInSign.map(p => {
                  const deg = degreeMap?.[p];
                  const degStr = deg != null ? `-${Number(deg).toFixed(1)}°` : '';
                  return (
                    <span key={p} className="si-p" style={{ color: PLANET_COLOR[p] || '#555' }}>
                      {PLANET_SHORT[p] || p.slice(0, 2)}{degStr}
                      {retrogradeMap?.[p] && <sup className="si-retro">R</sup>}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="si-center">
          <span className="si-center-star">✦</span>
        </div>
      </div>
    </div>
  );
}
