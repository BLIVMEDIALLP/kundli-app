import { useState } from 'react';
import NorthIndianChart from './NorthIndianChart.jsx';
import SouthIndianChart from './SouthIndianChart.jsx';
import { downloadKundliPdf } from '../lib/generatePdf.js';

const PLANET_SYMBOLS = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀',
  Mars: '♂', Jupiter: '♃', Saturn: '♄', Rahu: '☊', Ketu: '☋',
};

export default function Report({ data, onBack }) {
  const { report, kp, planets: rawPlanets } = data;
  if (!report) return null;

  const {
    summary, ascendantInterpretation, moonSignInterpretation, nakshatraInterpretation,
    housePlacements, planetaryStrengths, currentDasha, dashaTimeline, doshas, navamsha,
  } = report;

  const [activeTab, setActiveTab] = useState('basic');
  const [expandedDasha, setExpandedDasha] = useState(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownloadPdf() {
    setDownloading(true);
    try { await downloadKundliPdf(data); }
    catch (err) { console.error('PDF generation failed:', err); }
    finally { setDownloading(false); }
  }

  // Retrograde map for chart rendering
  const retrogradeMap = rawPlanets
    ? Object.fromEntries(Object.entries(rawPlanets).map(([n, p]) => [n, p.isRetrograde]))
    : {};

  // Degree map for chart rendering (planet name -> degree in sign)
  const degreeMap = rawPlanets
    ? Object.fromEntries(Object.entries(rawPlanets).map(([n, p]) => [n, p.degree ?? (p.longitude % 30)]))
    : {};

  // Ascendant degree
  const ascDegree = data.ascendant?.degree ?? null;

  // Bhav Chalit house placements from KP cusp-based house assignments (for North Indian chart)
  const bhavChality = kp ? (() => {
    const houses = Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: kp.cusps[i]?.sign || '', lord: '', planets: [] }));
    for (const [name, planet] of Object.entries(kp.kpPlanets)) {
      const h = planet.kpHouse;
      if (h >= 1 && h <= 12) houses[h - 1].planets.push(name);
    }
    return houses;
  })() : null;

  // Bhav Chalit planets for South Indian chart — each planet's sign replaced with its KP house's cusp sign
  // This makes planets appear in the cell of the sign they occupy by Placidus house, not their actual sign
  const bhavChalitPlanetsForSouth = kp ? (() => {
    const result = {};
    for (const [name, kpPlanet] of Object.entries(kp.kpPlanets)) {
      const houseSign = kp.cusps[kpPlanet.kpHouse - 1]?.sign || (rawPlanets?.[name]?.sign ?? '');
      result[name] = { ...(rawPlanets?.[name] || {}), sign: houseSign };
    }
    return result;
  })() : null;

  const tabs = [
    { id: 'basic', label: 'Basic Details' },
    { id: 'charts', label: 'Charts' },
    { id: 'planets', label: 'Planets' },
    { id: 'houses', label: 'Houses' },
    { id: 'kp', label: 'KP' },
    { id: 'dasha', label: 'Dasha' },
    { id: 'doshas', label: 'Doshas' },
    { id: 'navamsha', label: 'Navamsha (D9)' },
  ];

  return (
    <div className="report">
      <div className="report-topbar">
        <button className="back-btn" onClick={onBack}>← New Chart</button>
        <button className="pdf-btn" onClick={handleDownloadPdf} disabled={downloading}>
          {downloading ? '⏳ Generating…' : '⬇ Download PDF'}
        </button>
      </div>

      {/* Header */}
      <div className="report-header">
        <h2>{summary.name}</h2>
        <div className="report-meta">
          {summary.dateOfBirth} &bull; {summary.timeOfBirth} &bull; {summary.placeOfBirth}
        </div>
        <div className="birth-details">
          <BirthDetail label="Ascendant (Lagna)" value={`${summary.ascendant} (${summary.ascendantLord})`} />
          <BirthDetail label="Moon Sign (Rashi)" value={`${summary.moonSign} (${summary.rashiLord})`} />
          <BirthDetail label="Sun Sign" value={summary.sunSign} />
          <BirthDetail label="Birth Nakshatra" value={`${summary.birthNakshatra} Pada ${summary.nakshatraPada}`} />
          <BirthDetail label="Nakshatra Lord" value={summary.nakshatraLord} />
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} className={`tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Basic Details */}
      {activeTab === 'basic' && (
        <Section title="Astrological Profile">
          <div className="interp-block">
            <div className="interp-title">Ascendant — {ascendantInterpretation.sign} ({ascendantInterpretation.element} / {ascendantInterpretation.quality})</div>
            <div className="interp-text">{ascendantInterpretation.interpretation}</div>
          </div>
          <div className="interp-block">
            <div className="interp-title">Moon Sign — {moonSignInterpretation.sign}</div>
            <div className="interp-text">{moonSignInterpretation.interpretation}</div>
          </div>
          <div className="interp-block">
            <div className="interp-title">Birth Nakshatra — {nakshatraInterpretation.nakshatra} (Lord: {nakshatraInterpretation.lord})</div>
            <div className="interp-text">{nakshatraInterpretation.interpretation}</div>
          </div>
        </Section>
      )}

      {/* Charts */}
      {activeTab === 'charts' && (
        <>
          <div className="charts-section-label">North Indian Style</div>
          <div className="charts-pair">
            <Section title="Lagna Chart (Birth Chart)">
              <NorthIndianChart
                housePlacements={housePlacements}
                title="Lagna Chart"
                retrogradeMap={retrogradeMap}
                degreeMap={degreeMap}
                ascDegree={ascDegree}
              />
            </Section>
            {bhavChality && (
              <Section title="Bhav Chalit Chart (Placidus)">
                <NorthIndianChart
                  housePlacements={bhavChality}
                  title="Bhav Chalit"
                  retrogradeMap={retrogradeMap}
                  degreeMap={degreeMap}
                  ascDegree={ascDegree}
                />
              </Section>
            )}
          </div>
          <div className="charts-section-label">South Indian Style</div>
          <div className="charts-pair">
            <Section title="Lagna Chart — South Indian">
              <SouthIndianChart
                planets={data.planets}
                ascendantSign={summary.ascendant}
                title="South Indian Lagna"
                retrogradeMap={retrogradeMap}
                degreeMap={degreeMap}
              />
            </Section>
            {bhavChalitPlanetsForSouth && (
              <Section title="Bhav Chalit — South Indian">
                <SouthIndianChart
                  planets={bhavChalitPlanetsForSouth}
                  ascendantSign={summary.ascendant}
                  title="South Indian Bhav Chalit"
                  retrogradeMap={retrogradeMap}
                  degreeMap={degreeMap}
                />
              </Section>
            )}
          </div>
        </>
      )}

      {/* Planetary Positions */}
      {activeTab === 'planets' && (
        <Section title="Planetary Positions">
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
        </Section>
      )}

      {/* Houses */}
      {activeTab === 'houses' && (
        <Section title="House Placements (Whole Sign)">
          <div className="houses-grid">
            {housePlacements.map(h => (
              <div key={h.house} className="house-item">
                <div className="house-num">House {h.house}</div>
                <div className="house-sign">{h.sign} — {h.lord}</div>
                {h.planets.length > 0 && (
                  <div className="house-planets">{h.planets.map(p => `${PLANET_SYMBOLS[p] || ''} ${p}`).join(', ')}</div>
                )}
                <div className="house-meaning">{h.meaning}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* KP System */}
      {activeTab === 'kp' && kp && (
        <>
          {/* Ruling Planets */}
          <Section title="Ruling Planets">
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
          </Section>

          {/* KP Planets Table */}
          <Section title="KP Planets — Sign Lord · Star Lord · Sub Lord">
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
          </Section>

          {/* KP Cusps Table */}
          <Section title="KP Cusps (Placidus) — Sign Lord · Star Lord · Sub Lord">
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
          </Section>
        </>
      )}

      {/* Dasha */}
      {activeTab === 'dasha' && (
        <Section title="Vimshottari Dasha">
          {currentDasha && (
            <div className="dasha-current">
              <div className="maha">{currentDasha.mahadasha} Mahadasha</div>
              {currentDasha.antardasha && <div className="antar">{currentDasha.antardasha} Antardasha</div>}
              <div className="period">
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
                    onClick={() => setExpandedDasha(isExpanded ? null : i)}
                    style={{ cursor: 'pointer' }}
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
        </Section>
      )}

      {/* Doshas */}
      {activeTab === 'doshas' && (
        <Section title="Doshas & Afflictions">
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
        </Section>
      )}

      {/* Navamsha */}
      {activeTab === 'navamsha' && (
        <Section title="Navamsha Chart (D9)">
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
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="section-card">
      <div className="section-header"><h3>{title}</h3></div>
      <div className="section-body">{children}</div>
    </div>
  );
}

function BirthDetail({ label, value }) {
  return (
    <div className="birth-detail-item">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}
