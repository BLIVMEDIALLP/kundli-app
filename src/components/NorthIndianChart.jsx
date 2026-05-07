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

// House number positions (red numbers)
const HNUM = {
  1:  { x: M + 80, y: M - 105 },  // top-right trapezoid, upper
  12: { x: M + 80, y: M - 60 },   // top-right trapezoid, lower
  2:  { x: M,      y: M - 55 },   // center diamond, top
  3:  { x: M - 80, y: M - 105 },  // top-left trapezoid, upper
  4:  { x: M - 80, y: M - 60 },   // top-left trapezoid, lower
  5:  { x: M - 55, y: M },        // center diamond, left
  6:  { x: M - 80, y: M + 60 },   // bottom-left trapezoid, upper
  7:  { x: M - 80, y: M + 105 },  // bottom-left trapezoid, lower
  8:  { x: M,      y: M + 55 },   // center diamond, bottom
  9:  { x: M + 80, y: M + 105 },  // bottom-right trapezoid, lower
  10: { x: M + 80, y: M + 60 },   // bottom-right trapezoid, upper
  11: { x: M + 55, y: M },        // center diamond, right
};

// Planet text positions (center of each house area for planet labels)
const PPOS = {
  1:  { x: M + 80, y: M - 130 },  // top-right, upper area
  12: { x: M + 80, y: M - 35 },   // top-right, lower area
  2:  { x: M,      y: M - 75 },   // center top
  3:  { x: M - 80, y: M - 130 },  // top-left, upper area
  4:  { x: M - 80, y: M - 35 },   // top-left, lower area
  5:  { x: M - 75, y: M },        // center left
  6:  { x: M - 80, y: M + 35 },   // bottom-left, upper area
  7:  { x: M - 80, y: M + 130 },  // bottom-left, lower area
  8:  { x: M,      y: M + 75 },   // center bottom
  9:  { x: M + 80, y: M + 130 },  // bottom-right, lower area
  10: { x: M + 80, y: M + 35 },   // bottom-right, upper area
  11: { x: M + 75, y: M },        // center right
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

          {/* Ascendant label — between house 1 and 12 in top-right */}
          <text
            x={M + 45}
            y={M - 82}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#9a8030"
            fontSize="9.5"
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
