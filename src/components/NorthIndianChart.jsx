// Traditional North Indian Kundli Chart — SVG diamond layout
//
// Standard layout:
//   Corner trapezoids (2 houses each, split by corner diagonal):
//     Top-right: 1 (upper), 12 (lower)    Top-left: 3 (upper), 4 (lower)
//     Bot-left:  6 (upper), 7 (lower)     Bot-right: 9 (lower), 10 (upper)
//   Center diamond (4 triangular sections):
//     Top: 2    Left: 5    Bottom: 8    Right: 11

const PLANET_SHORT = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
};

const PLANET_COLOR = {
  Sun: '#c85010', Moon: '#2050c0', Mars: '#c02020', Mercury: '#1a7a48',
  Jupiter: '#9a7010', Venus: '#b02888', Saturn: '#3a5070',
  Rahu: '#a05020', Ketu: '#5a2880',
};

const S = 400;
const M = S / 2; // 200
const P = 6;     // padding

// House number positions (red numbers) — geometrically inside each triangular region
const HNUM = {
  1:  { x: 295, y: 30 },   // top-right corner, upper triangle
  12: { x: 362, y: 95 },   // top-right corner, lower triangle
  2:  { x: 200, y: 55 },   // center diamond, top kite
  3:  { x: 105, y: 30 },   // top-left corner, upper triangle
  4:  { x: 38,  y: 95 },   // top-left corner, lower triangle
  5:  { x: 55,  y: 200 },  // center diamond, left kite
  6:  { x: 38,  y: 305 },  // bottom-left corner, upper triangle
  7:  { x: 105, y: 370 },  // bottom-left corner, lower triangle
  8:  { x: 200, y: 345 },  // center diamond, bottom kite
  9:  { x: 295, y: 370 },  // bottom-right corner, lower triangle
  10: { x: 362, y: 305 },  // bottom-right corner, upper triangle
  11: { x: 345, y: 200 },  // center diamond, right kite
};

// Planet text positions — centered in each house's geometric region
const PPOS = {
  1:  { x: 295, y: 52 },   // top-right upper triangle
  12: { x: 355, y: 120 },  // top-right lower triangle
  2:  { x: 200, y: 95 },   // center diamond top
  3:  { x: 105, y: 52 },   // top-left upper triangle
  4:  { x: 45,  y: 120 },  // top-left lower triangle
  5:  { x: 95,  y: 200 },  // center diamond left
  6:  { x: 45,  y: 280 },  // bottom-left upper triangle
  7:  { x: 105, y: 348 },  // bottom-left lower triangle
  8:  { x: 200, y: 305 },  // center diamond bottom
  9:  { x: 295, y: 348 },  // bottom-right lower triangle
  10: { x: 355, y: 280 },  // bottom-right upper triangle
  11: { x: 305, y: 200 },  // center diamond right
};

function PlanetGroup({ planets, pos, retrogradeMap, degreeMap }) {
  if (!planets || planets.length === 0) return null;
  const lineH = 13;
  const totalH = planets.length * lineH;
  const startY = pos.y - totalH / 2 + lineH / 2;

  return planets.map((p, i) => {
    const color = PLANET_COLOR[p] || '#555';
    const name = PLANET_SHORT[p] || p.slice(0, 2);
    const isRetro = retrogradeMap?.[p];
    const deg = degreeMap?.[p];
    const degStr = deg != null ? `-${Number(deg).toFixed(1)}°` : '';
    return (
      <text
        key={p}
        x={pos.x}
        y={startY + i * lineH}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize="10"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        {name}{degStr}{isRetro ? '®' : ''}
      </text>
    );
  });
}

export default function NorthIndianChart({
  housePlacements, title, retrogradeMap, degreeMap, ascDegree
}) {
  const h = (n) => housePlacements?.find(hp => hp.house === n);

  return (
    <div className="ni-wrap">
      <div className="ni-title">{title}</div>
      <div className="ni-svg-wrap">
        <svg viewBox={`0 0 ${S} ${S}`} width="100%" style={{ maxWidth: 420 }}>
          {/* Cream background */}
          <rect x={P} y={P} width={S - P * 2} height={S - P * 2}
            fill="#f8f0d8" stroke="#c8a030" strokeWidth="2.5" />

          {/* Diamond — connects midpoints of each side */}
          <polygon
            points={`${M},${P} ${S - P},${M} ${M},${S - P} ${P},${M}`}
            fill="none" stroke="#c8a030" strokeWidth="1.5"
          />

          {/* Diagonals from corners to center */}
          <line x1={P} y1={P} x2={M} y2={M} stroke="#c8a030" strokeWidth="1" />
          <line x1={S - P} y1={P} x2={M} y2={M} stroke="#c8a030" strokeWidth="1" />
          <line x1={S - P} y1={S - P} x2={M} y2={M} stroke="#c8a030" strokeWidth="1" />
          <line x1={P} y1={S - P} x2={M} y2={M} stroke="#c8a030" strokeWidth="1" />

          {/* House numbers in red */}
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
            <text
              key={`h${num}`}
              x={HNUM[num].x}
              y={HNUM[num].y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#cc3333"
              fontSize="11"
              fontWeight="700"
              fontFamily="Inter, sans-serif"
            >
              {num}
            </text>
          ))}

          {/* Ascendant label — inside house 1 triangle */}
          <text
            x={295}
            y={15}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#9a8030"
            fontSize="9"
            fontStyle="italic"
            fontFamily="Inter, sans-serif"
          >
            Asc{ascDegree != null ? `-${Number(ascDegree).toFixed(2)}°` : ''}
          </text>

          {/* Planets in each house */}
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
            <PlanetGroup
              key={`p${num}`}
              planets={h(num)?.planets}
              pos={PPOS[num]}
              retrogradeMap={retrogradeMap}
              degreeMap={degreeMap}
            />
          ))}

          {/* Decorative corner circles */}
          <circle cx={P + 5} cy={P + 5} r="5.5" fill="#c8a030" opacity="0.25" />
          <circle cx={S - P - 5} cy={P + 5} r="5.5" fill="#c8a030" opacity="0.25" />
          <circle cx={S - P - 5} cy={S - P - 5} r="5.5" fill="#c8a030" opacity="0.25" />
          <circle cx={P + 5} cy={S - P - 5} r="5.5" fill="#c8a030" opacity="0.25" />
        </svg>
      </div>
    </div>
  );
}
