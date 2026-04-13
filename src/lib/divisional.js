import { SIGNS, SIGN_LORDS } from './constants.js';

const SIGN_ELEMENT = [0,1,2,3,0,1,2,3,0,1,2,3];
const NAVAMSHA_START = [0,9,6,3];

function getNavamshaSign(longitude) {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const navamshaNum = Math.floor(degInSign / (30 / 9));
  const element = SIGN_ELEMENT[signIndex];
  const navamshaSignIndex = (NAVAMSHA_START[element] + navamshaNum) % 12;
  return { sign: SIGNS[navamshaSignIndex], signIndex: navamshaSignIndex, lord: SIGN_LORDS[SIGNS[navamshaSignIndex]] };
}

function getDrekkanaSign(longitude) {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const drekkanaNum = degInSign < 10 ? 0 : degInSign < 20 ? 1 : 2;
  const element = SIGN_ELEMENT[signIndex];
  const startSigns = [0,1,2,3];
  const drekkanaSignIndex = (startSigns[element] + drekkanaNum * 4) % 12;
  return { sign: SIGNS[drekkanaSignIndex], signIndex: drekkanaSignIndex, lord: SIGN_LORDS[SIGNS[drekkanaSignIndex]] };
}

function getDashamsha(longitude) {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const dashamsha = Math.floor(degInSign / 3);
  const isOdd = signIndex % 2 === 0;
  const finalIndex = ((isOdd ? signIndex * 10 + dashamsha : signIndex * 10 + 9 - dashamsha) % 12 + 12) % 12;
  return { sign: SIGNS[finalIndex], signIndex: finalIndex, lord: SIGN_LORDS[SIGNS[finalIndex]] };
}

function getDwadashamsha(longitude) {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const dwadashamsha = Math.floor(degInSign / 2.5);
  const dwadashaSignIndex = (signIndex + dwadashamsha) % 12;
  return { sign: SIGNS[dwadashaSignIndex], signIndex: dwadashaSignIndex, lord: SIGN_LORDS[SIGNS[dwadashaSignIndex]] };
}

export function calcDivisionalCharts(planets) {
  const charts = { D3: {}, D9: {}, D10: {}, D12: {} };
  for (const [name, planet] of Object.entries(planets)) {
    charts.D9[name] = getNavamshaSign(planet.longitude);
    charts.D3[name] = getDrekkanaSign(planet.longitude);
    charts.D10[name] = getDashamsha(planet.longitude);
    charts.D12[name] = getDwadashamsha(planet.longitude);
  }
  return charts;
}
