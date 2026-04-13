// North Indian Kundli Chart — table-based layout
// Houses are FIXED in position. Signs rotate anti-clockwise from Lagna (House 1).
//
//  [12] [ 1] [ 2] [ 3]
//  [11] [   ] [   ] [ 4]
//  [10] [   ] [   ] [ 5]
//  [ 9] [ 8] [ 7] [ 6]

const PLANET_SHORT = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
};

const PLANET_COLOR = {
  Sun: '#c85010', Moon: '#2050c0', Mars: '#c02020', Mercury: '#1a7a48',
  Jupiter: '#9a7010', Venus: '#b02888', Saturn: '#3a5070',
  Rahu: '#a05020', Ketu: '#5a2880',
};

function Cell({ hp, isLagna, retrogradeMap }) {
  const planets = hp?.planets || [];
  return (
    <td className={`ni-td${isLagna ? ' ni-td-lagna' : ''}`}>
      <div className="ni-td-num">{hp?.house}</div>
      {hp?.sign && <div className="ni-td-sign">{hp.sign.slice(0, 3)}</div>}
      <div className="ni-td-planets">
        {isLagna && <span className="ni-td-lag">Lag</span>}
        {planets.map(p => (
          <span key={p} className="ni-td-p" style={{ color: PLANET_COLOR[p] || '#555' }}>
            {PLANET_SHORT[p] || p.slice(0, 2)}
            {retrogradeMap?.[p] && <sup className="ni-td-retro">R</sup>}
          </span>
        ))}
      </div>
    </td>
  );
}

export default function NorthIndianChart({ housePlacements, title, retrogradeMap }) {
  const h = (n) => housePlacements?.find(hp => hp.house === n);
  return (
    <div className="ni-wrap">
      <div className="ni-title">{title}</div>
      <div className="ni-table-wrap">
        <table className="ni-table">
          <tbody>
            <tr>
              <Cell hp={h(12)} retrogradeMap={retrogradeMap} />
              <Cell hp={h(1)} isLagna retrogradeMap={retrogradeMap} />
              <Cell hp={h(2)} retrogradeMap={retrogradeMap} />
              <Cell hp={h(3)} retrogradeMap={retrogradeMap} />
            </tr>
            <tr>
              <Cell hp={h(11)} retrogradeMap={retrogradeMap} />
              <td className="ni-td-center" colSpan={2} rowSpan={2}>
                <span className="ni-center-star">✦</span>
              </td>
              <Cell hp={h(4)} retrogradeMap={retrogradeMap} />
            </tr>
            <tr>
              <Cell hp={h(10)} retrogradeMap={retrogradeMap} />
              <Cell hp={h(5)} retrogradeMap={retrogradeMap} />
            </tr>
            <tr>
              <Cell hp={h(9)} retrogradeMap={retrogradeMap} />
              <Cell hp={h(8)} retrogradeMap={retrogradeMap} />
              <Cell hp={h(7)} retrogradeMap={retrogradeMap} />
              <Cell hp={h(6)} retrogradeMap={retrogradeMap} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
