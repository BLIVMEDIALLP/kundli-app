// Traditional North Indian Kundli Chart — SVG diamond layout
//
// Standard layout (House 1 = top center diamond):
//   Center diamond:  Top: 1    Left: 4    Bottom: 7    Right: 10
//   Corner trapezoids (split by corner diagonal):
//     Top-right: 12 (upper), 11 (lower)    Top-left: 2 (upper), 3 (lower)
//     Bot-left:  5 (upper), 6 (lower)      Bot-right: 8 (lower), 9 (upper)

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

// House number positions — House 1 at top center diamond, counter-clockwise
const HNUM = {
  1:  { x: 200, y: 55 },   // center diamond top
  2:  { x: 105, y: 30 },   // top-left corner, upper triangle
  3:  { x: 38,  y: 95 },   // top-left corner, lower triangle
  4:  { x: 55,  y: 200 },  // center diamond left
  5:  { x: 38,  y: 305 },  // bottom-left corner, upper triangle
  6:  { x: 105, y: 370 },  // bottom-left corner, lower triangle
  7:  { x: 200, y: 345 },  // center diamond bottom
  8:  { x: 295, y: 370 },  // bottom-right corner, lower triangle
  9:  { x: 362, y: 305 },  // bottom-right corner, upper triangle
  10: { x: 345, y: 200 },  // center diamond right
  11: { x: 362, y: 95 },   // top-right corner, lower triangle
  12: { x: 295, y: 30 },   // top-right corner, upper triangle
};

// Planet text positions — centered in each house's geometric region
const PPOS = {
  1:  { x: 200, y: 95 },   // center diamond top
  2:  { x: 105, y: 52 },   // top-left upper triangle
  3:  { x: 45,  y: 120 },  // top-left lower triangle
  4:  { x: 95,  y: 200 },  // center diamond left
  5:  { x: 45,  y: 280 },  // bottom-left upper triangle
  6:  { x: 105, y: 348 },  // bottom-left lower triangle
  7:  { x: 200, y: 305 },  // center diamond bottom
  8:  { x: 295, y: 348 },  // bottom-right lower triangle
  9:  { x: 355, y: 280 },  // bottom-right upper triangle
  10: { x: 305, y: 200 },  // center diamond right
  11: { x: 355, y: 120 },  // top-right lower triangle
  12: { x: 295, y: 52 },   // top-right upper triangle
};

// Sign label positions — small sign name inside each house
const SIGN_POS = {
  1:  { x: 200, y: 40 },
  2:  { x: 105, y: 18 },
  3:  { x: 22,  y: 80 },
  4:  { x: 30,  y: 200 },
  5:  { x: 22,  y: 320 },
  6:  { x: 105, y: 384 },
  7:  { x: 200, y: 360 },
  8:  { x: 295, y: 384 },
  9:  { x: 378, y: 320 },
  10: { x: 370, y: 200 },
  11: { x: 378, y: 80 },
  12: { x: 295, y: 18 },
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

          {/* Sign names in each house */}
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => {
            const sign = h(num)?.sign;
            if (!sign) return null;
            return (
              <text
                key={`s${num}`}
                x={SIGN_POS[num].x}
                y={SIGN_POS[num].y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#8a7a50"
                fontSize="11"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                {sign.slice(0, 3)}
              </text>
            );
          })}

          {/* Ascendant label — inside house 1 (top center diamond) */}
          <text
            x={200}
            y={22}
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
