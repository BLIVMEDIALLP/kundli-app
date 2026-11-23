import { useRef, useState } from 'react';
import NorthIndianChart from './NorthIndianChart.jsx';
import SouthIndianChart from './SouthIndianChart.jsx';

const PLANET_SYMBOLS = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀',
  Mars: '♂', Jupiter: '♃', Saturn: '♄', Rahu: '☊', Ketu: '☋',
};

const TABS = [
  { id: 'basic', label: 'Basic Details' },
  { id: 'charts', label: 'Charts' },
  { id: 'planets', label: 'Planets' },
  { id: 'houses', label: 'Houses' },
  { id: 'kp', label: 'KP' },
  { id: 'dasha', label: 'Dasha' },
  { id: 'doshas', label: 'Doshas' },
  { id: 'navamsha', label: 'Navamsha (D9)' },
];

export default function Report({ data, onBack, initialTab = 'basic', isExample = false }) {
  const { report, kp, planets: rawPlanets } = data;
  if (!report) return null;

  const {
    summary, ascendantInterpretation, moonSignInterpretation, nakshatraInterpretation,
    housePlacements, planetaryStrengths, currentDasha, dashaTimeline, doshas, navamsha,
  } = report;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [expandedDasha, setExpandedDasha] = useState(null);
  const tabRefs = useRef([]);

  function handleTabKeyDown(e, index) {
    let newIndex = null;
    if (e.key === 'ArrowRight') newIndex = (index + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') newIndex = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') newIndex = 0;
    else if (e.key === 'End') newIndex = TABS.length - 1;
    if (newIndex === null) return;
    e.preventDefault();
    setActiveTab(TABS[newIndex].id);
    tabRefs.current[newIndex]?.focus();
  }

  const retrogradeMap = rawPlanets
    ? Object.fromEntries(Object.entries(rawPlanets).map(([n, p]) => [n, p.isRetrograde]))
    : {};
  const degreeMap = rawPlanets
    ? Object.fromEntries(Object.entries(rawPlanets).map(([n, p]) => [n, p.degree ?? (p.longitude % 30)]))
    : {};
  const ascDegree = data.ascendant?.degree ?? null;

  const bhavChalit = kp ? (() => {
    const houses = Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: kp.cusps[i]?.sign || '', lord: '', planets: [] }));
    for (const [name, planet] of Object.entries(kp.kpPlanets)) {
      const h = planet.kpHouse;
      if (h >= 1 && h <= 12) houses[h - 1].planets.push(name);
    }
    return houses;
  })() : null;

  const bhavChalitPlanetsForSouth = kp ? (() => {
    const result = {};
    for (const [name, kpPlanet] of Object.entries(kp.kpPlanets)) {
      const houseSign = kp.cusps[kpPlanet.kpHouse - 1]?.sign || (rawPlanets?.[name]?.sign ?? '');
      result[name] = { ...(rawPlanets?.[name] || {}), sign: houseSign };
    }
    return result;
  })() : null;

  return (
    <section id="report" className="report-chapter chapter">
      <div className="wrap report">
        <div className="report-actions">
          <button type="button" className="button outline" onClick={onBack}>← Back to birth form</button>
          <button type="button" className="button primary" onClick={() => window.print()}>↓ Save as PDF</button>
        </div>

        <div className="report-hero">
          <div className="report-heading">
            <div className="eyebrow"><span aria-hidden="true">✦</span> {isExample ? 'SAMPLE KUNDLI REPORT' : 'KUNDLI REPORT'}</div>
            <h2>{summary.name}</h2>
            <p>{summary.dateOfBirth} · {summary.timeOfBirth} · {summary.placeOfBirth}</p>
          </div>
          <div className="report-brand">
            <img className="shri-logo" src="/shri-aaum-logo.webp" width="99" height="128" alt="" />
            <div><strong>Shri Aaum</strong><a href="https://shriaaum.com/" target="_blank" rel="noopener noreferrer">shriaaum.com</a></div>
          </div>
        </div>

        {isExample && (
          <p className="preview-note">This sample uses example birth details. Browse the tabs to explore the report.</p>
        )}

        <div className="traits">
          <Trait label="Ascendant (Lagna)" value={`${summary.ascendant} · ${summary.ascendantLord}`} />
          <Trait label="Moon sign (Rashi)" value={`${summary.moonSign} · ${summary.rashiLord}`} />
          <Trait label="Sun sign" value={summary.sunSign} />
          <Trait label="Birth Nakshatra" value={`${summary.birthNakshatra} · Pada ${summary.nakshatraPada}`} />
          <Trait label="Nakshatra lord" value={summary.nakshatraLord} />
        </div>

        <div className="tabs" role="tablist" aria-label="Kundli report sections">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={el => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-controls={`panel-${t.id}`}
              className={`tab ${activeTab === t.id ? 'active' : ''}`}
              aria-selected={activeTab === t.id}
              tabIndex={activeTab === t.id ? 0 : -1}
              onClick={() => setActiveTab(t.id)}
              onKeyDown={e => handleTabKeyDown(e, i)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Basic Details */}
        <section className="panel" id="panel-basic" role="tabpanel" aria-labelledby="tab-basic" hidden={activeTab !== 'basic'}>
          <h3>Astrological profile</h3>
          <div className="report-grid">
            <ReportCard
              heading={`Ascendant · ${ascendantInterpretation.sign}`}
              body={ascendantInterpretation.interpretation}
            />
            <ReportCard
              heading={`Moon sign · ${moonSignInterpretation.sign}`}
              body={moonSignInterpretation.interpretation}
            />
            <ReportCard
              heading={`Birth Nakshatra · ${nakshatraInterpretation.nakshatra}`}
              body={`Lord: ${nakshatraInterpretation.lord}. ${nakshatraInterpretation.interpretation}`}
            />
          </div>
        </section>

        {/* Charts */}
        <section className="panel" id="panel-charts" role="tabpanel" aria-labelledby="tab-charts" hidden={activeTab !== 'charts'}>
          <h3>Birth chart views</h3>
          <div className="charts-section-label">North Indian style</div>
          <div className="charts-pair">
            <ChartCard title="Lagna Chart">
              <NorthIndianChart housePlacements={housePlacements} title="Lagna Chart" retrogradeMap={retrogradeMap} degreeMap={degreeMap} ascDegree={ascDegree} />
            </ChartCard>
            {bhavChalit && (
              <ChartCard title="Bhav Chalit Chart (Placidus)">
                <NorthIndianChart housePlacements={bhavChalit} title="Bhav Chalit" retrogradeMap={retrogradeMap} degreeMap={degreeMap} ascDegree={ascDegree} />
              </ChartCard>
            )}
          </div>
          <div className="charts-section-label">South Indian style</div>
          <div className="charts-pair">
            <ChartCard title="South Indian Lagna">
              <SouthIndianChart planets={data.planets} ascendantSign={summary.ascendant} title="South Indian Lagna" retrogradeMap={retrogradeMap} degreeMap={degreeMap} />
            </ChartCard>
            {bhavChalitPlanetsForSouth && (
              <ChartCard title="South Indian Bhav Chalit">
                <SouthIndianChart planets={bhavChalitPlanetsForSouth} ascendantSign={summary.ascendant} title="South Indian Bhav Chalit" retrogradeMap={retrogradeMap} degreeMap={degreeMap} />
              </ChartCard>
            )}
          </div>
        </section>

        {/* Planets */}
        <section className="panel" id="panel-planets" role="tabpanel" aria-labelledby="tab-planets" hidden={activeTab !== 'planets'}>
          <h3>Planetary positions</h3>
          <div className="table-wrap">
            <table className="planet-table">
              <thead>
                <tr>
                  <th>Planet</th><th>Sign</th><th>House</th><th>Degree</th>
                  <th>Nakshatra</th><th>Pada</th><th>AV Score</th>
                </tr>
              </thead>
              <tbody>
                {planetaryStrengths.map(p => (
                  <tr key={p.planet}>
                    <td>
                      <span className="planet-sym">{PLANET_SYMBOLS[p.planet] || ''}</span>
                      {p.planet}
                      {p.isRetrograde && <span className="badge retro">R</span>}
                    </td>
                    <td>{p.sign}</td>
                    <td>{p.house}</td>
                    <td>{p.degree?.toFixed(2)}°</td>
                    <td>{p.nakshatra}</td>
                    <td>{p.pada}</td>
                    <td>
                      {p.ashtakavargaScore !== null ? (
                        <span className={`badge ${p.ashtakavargaScore >= 5 ? 'strong' : p.ashtakavargaScore >= 3 ? 'moderate' : 'weak'}`}>
                          {p.ashtakavargaScore}/8
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Houses */}
        <section className="panel" id="panel-houses" role="tabpanel" aria-labelledby="tab-houses" hidden={activeTab !== 'houses'}>
          <h3>The twelve houses</h3>
          <div className="houses-grid">
            {housePlacements.map(h => (
              <ReportCard
                key={h.house}
                heading={`House ${h.house} · ${h.sign}`}
                body={`Lord · ${h.lord}${h.planets.length ? `<br>Planets · ${h.planets.map(p => `${PLANET_SYMBOLS[p] || ''} ${p}`).join(', ')}` : ''}<br>${h.meaning}`}
              />
            ))}
          </div>
        </section>

        {/* KP */}
        <section className="panel" id="panel-kp" role="tabpanel" aria-labelledby="tab-kp" hidden={activeTab !== 'kp'}>
          {kp && (
            <>
              <h3>Krishnamurti Paddhati (KP)</h3>
              <div className="kp-ruling-grid">
                <div className="kp-ruling-card">
                  <div className="kp-ruling-label">Ascendant</div>
                  <div className="kp-ruling-row"><span>Sign Lord</span><span className="kp-val">{kp.rulingPlanets.ascSignLord}</span></div>
                  <div className="kp-ruling-row"><span>Star Lord</span><span className="kp-val">{kp.rulingPlanets.ascStarLord}</span></div>
                  <div className="kp-ruling-row"><span>Sub Lord</span><span className="kp-val">{kp.rulingPlanets.ascSubLord}</span></div>
                </div>
                <div className="kp-ruling-card">
                  <div className="kp-ruling-label">Moon</div>
                  <div className="kp-ruling-row"><span>Sign Lord</span><span className="kp-val">{kp.rulingPlanets.moonSignLord}</span></div>
                  <div className="kp-ruling-row"><span>Star Lord</span><span className="kp-val">{kp.rulingPlanets.moonStarLord}</span></div>
                  <div className="kp-ruling-row"><span>Sub Lord</span><span className="kp-val">{kp.rulingPlanets.moonSubLord}</span></div>
                </div>
                <div className="kp-ruling-card">
                  <div className="kp-ruling-label">Day Lord</div>
                  <div className="kp-ruling-row"><span>Planet</span><span className="kp-val">{kp.rulingPlanets.dayLord}</span></div>
                </div>
              </div>
              <br />
              <div className="table-wrap">
                <table className="planet-table">
                  <thead>
                    <tr>
                      <th>Planet</th><th>Sign</th><th>Degree</th><th>KP House</th>
                      <th>Nakshatra</th><th>Sign Lord</th><th>Star Lord</th><th>Sub Lord</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(kp.kpPlanets).map(p => (
                      <tr key={p.planet}>
                        <td>
                          <span className="planet-sym">{PLANET_SYMBOLS[p.planet] || ''}</span>
                          {p.planet}
                          {p.isRetrograde && <span className="badge retro">R</span>}
                        </td>
                        <td>{p.sign}</td>
                        <td>{p.degree?.toFixed(2)}°</td>
                        <td>{p.kpHouse}</td>
                        <td>{p.nakshatra}</td>
                        <td className="kp-lord">{p.signLord}</td>
                        <td className="kp-lord">{p.starLord}</td>
                        <td className="kp-lord kp-sub">{p.subLord}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <br />
              <div className="table-wrap">
                <table className="planet-table">
                  <thead>
                    <tr>
                      <th>Cusp</th><th>Degree</th><th>Sign</th><th>Nakshatra</th>
                      <th>Sign Lord</th><th>Star Lord</th><th>Sub Lord</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kp.cusps.map(c => (
                      <tr key={c.house}>
                        <td className="cusp-num">{c.house}</td>
                        <td>{c.degree}°</td>
                        <td>{c.sign}</td>
                        <td>{c.nakshatra}</td>
                        <td className="kp-lord">{c.signLord}</td>
                        <td className="kp-lord">{c.starLord}</td>
                        <td className="kp-lord kp-sub">{c.subLord}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {/* Dasha */}
        <section className="panel" id="panel-dasha" role="tabpanel" aria-labelledby="tab-dasha" hidden={activeTab !== 'dasha'}>
          <h3>Vimshottari Dasha</h3>
          {currentDasha && (
            <div className="dasha-current">
              <div className="maha">{currentDasha.mahadasha} Mahadasha</div>
              {currentDasha.antardasha && <div className="antar">{currentDasha.antardasha} Antardasha</div>}
              <div className="period-range">
                Maha: {currentDasha.mahaStart} → {currentDasha.mahaEnd}
                {currentDasha.antarEnd && ` · Antar ends: ${currentDasha.antarEnd}`}
              </div>
              <div className="dasha-interp">{currentDasha.interpretation}</div>
            </div>
          )}
          <div className="dasha-timeline">
            {dashaTimeline.map((d, i) => {
              const isActive = currentDasha?.mahadasha === d.lord;
              const isExpanded = expandedDasha === i;
              return (
                <div key={i}>
                  <div
                    className={`dasha-item ${isActive ? 'active' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedDasha(isExpanded ? null : i)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedDasha(isExpanded ? null : i);
                      }
                    }}
                  >
                    <div className="dasha-lord">{PLANET_SYMBOLS[d.lord] || ''} {d.lord}</div>
                    <div className="dasha-dates">{d.start} → {d.end}</div>
                    <div className="dasha-years">{d.years.toFixed(1)}y</div>
                    <div className="dasha-expand">{isExpanded ? '▲' : '▼'}</div>
                  </div>
                  {isExpanded && d.antardashas && (
                    <div className="antardasha-list">
                      {d.antardashas.map((a, j) => {
                        const isCurrentAntar = currentDasha?.mahadasha === d.lord && currentDasha?.antardasha === a.lord;
                        return (
                          <div key={j} className={`antar-item ${isCurrentAntar ? 'active' : ''}`}>
                            <span className="antar-lord">{a.lord}</span>
                            <span className="antar-dates">{a.start} → {a.end}</span>
                            <span className="antar-years">{a.years.toFixed(2)}y</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Doshas */}
        <section className="panel" id="panel-doshas" role="tabpanel" aria-labelledby="tab-doshas" hidden={activeTab !== 'doshas'}>
          <h3>Dosha assessment</h3>
          <div className="dosha-list">
            {doshas.map((d, i) => (
              <div key={i} className={`dosha-item ${!d.present ? 'none' : d.severity === 'High' ? 'high' : 'mod'}`}>
                <div className="dosha-name">{d.name}</div>
                {d.present && <div className="dosha-severity">Severity: {d.severity}</div>}
                <div className="dosha-desc">{d.description}</div>
                {d.remedy && <div className="dosha-remedy">Remedy: {d.remedy}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Navamsha */}
        <section className="panel" id="panel-navamsha" role="tabpanel" aria-labelledby="tab-navamsha" hidden={activeTab !== 'navamsha'}>
          <h3>Navamsha (D9)</h3>
          <div className="table-wrap">
            <table className="planet-table">
              <thead>
                <tr><th>Planet</th><th>Navamsha Sign</th><th>Sign Lord</th></tr>
              </thead>
              <tbody>
                {navamsha.map(n => (
                  <tr key={n.planet}>
                    <td>{PLANET_SYMBOLS[n.planet] || ''} {n.planet}</td>
                    <td>{n.navamshaSign}</td>
                    <td>{n.lord}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}

function Trait({ label, value }) {
  return <div className="trait">{label}<strong>{value}</strong></div>;
}

function ReportCard({ heading, body }) {
  return <article className="report-card"><h4>{heading}</h4><p dangerouslySetInnerHTML={{ __html: body }} /></article>;
}

function ChartCard({ title, children }) {
  return (
    <article className="chart-card">
      <h4>{title}</h4>
      {children}
    </article>
  );
}
