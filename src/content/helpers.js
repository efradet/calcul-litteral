// Outils pour écrire les exercices : hasard reproductible, écriture des polynômes, étapes de corrigé.
import {polyOf, polyToSource, pmul, padd, pneg, pconst, Q, monoOf} from '../algebra.js';

// ---------- Hasard reproductible (une graine = une série) ----------
export function makeRng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (lo, hi) => lo + Math.floor(next() * (hi - lo + 1));
  return {
    next,
    int,
    nz: (lo, hi) => { let v; do v = int(lo, hi); while (v === 0); return v; },
    pick: arr => arr[Math.floor(next() * arr.length)],
    sign: () => (next() < 0.5 ? -1 : 1),
    distinct(count, lo, hi, exclude = []) {
      const out = [];
      while (out.length < count) { const v = int(lo, hi); if (!out.includes(v) && !exclude.includes(v)) out.push(v); }
      return out;
    },
    shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  };
}

// ---------- Écriture ----------
export const P = src => polyOf(src);
export const S = poly => polyToSource(typeof poly === 'string' ? polyOf(poly) : poly).replace(/ /g, '');
// a·v + b (v lettre, b constante), écrit proprement : "2x+3", "x-4", "-x+5"
export const lin = (a, b, v = 'x') => S(padd(pmul(pconst(Q(a)), polyOf(v)), pconst(Q(b))));
export const quad = (a, b, c, v = 'x') => S(`${a}*${v}^2+(${b})*${v}+(${c})`);
// terme signé pour une somme : "+ 3", "- 4"
export const signed = n => (n < 0 ? `- ${-n}` : `+ ${n}`);
// nombre entre parenthèses s'il est négatif (pour écrire des produits)
export const pn = n => (n < 0 ? `(${n})` : `${n}`);
export const wrap = src => `(${src})`;

// Termes d'un polynôme dans l'ordre d'écriture, chacun en source sans signe extérieur
export function termsOf(src) {
  const p = typeof src === 'string' ? polyOf(src) : src;
  const s = polyToSource(p);
  // découpe "2x^2 - 5x - 12" en termes signés
  const parts = s.replace(/^-/, '−').split(/ (?=[+-] )/).map(t => t.replace(/^[+] /, '').replace(/^- /, '-').replace(/^−/, '-'));
  return parts;
}
const wrapNeg = t => (t.startsWith('-') ? `(${t})` : t);

// Étape « on multiplie chaque terme par chaque terme » pour A·B, et la même chose effectuée sans réduire
export function distributeSteps(aSrc, bSrc) {
  const A = termsOf(aSrc), B = termsOf(bSrc);
  const products = [], results = [];
  for (const a of A) for (const b of B) {
    products.push(`${wrapNeg(a)}*${wrapNeg(b)}`);
    results.push(S(`(${a})*(${b})`));
  }
  const joined = results.map((r, i) => (i === 0 ? r : r.startsWith('-') ? ` - ${r.slice(1)}` : ` + ${r}`)).join('');
  return {products: products.join(' + '), results: joined};
}

// Corrigé complet d'un produit A·B : distribuer, effectuer, réduire
export function productSteps(aSrc, bSrc, note = 'On multiplie chaque terme du premier facteur par chaque terme du second.') {
  const d = distributeSteps(aSrc, bSrc);
  const final = S(`(${aSrc})*(${bSrc})`);
  const steps = [{src: d.products, note}, {src: d.results}];
  if (S(d.results) !== d.results.replace(/ /g, '') || d.results.replace(/ /g, '') !== final) steps.push({src: final, note: 'On réduit.'});
  return dedupe(steps);
}

// enlève les étapes identiques à la précédente
export function dedupe(steps) {
  const out = [];
  for (const s of steps) {
    const prev = out[out.length - 1];
    if (prev && prev.src && s.src && prev.src.replace(/ /g, '') === s.src.replace(/ /g, '') && !s.note) continue;
    out.push(s);
  }
  return out;
}

// Opposé d'un polynôme, écrit terme à terme (pour enlever une parenthèse précédée de -)
export const opposite = src => S(pneg(polyOf(src)));

// Joint des morceaux "A", "B" en somme lisible : join(['2x', '-3', '+x']) -> "2x - 3 + x"
export function joinTerms(list) {
  return list.map((t, i) => {
    const s = t.trim();
    if (i === 0) return s;
    if (s.startsWith('-')) return ` - ${s.slice(1).trim()}`;
    if (s.startsWith('+')) return ` + ${s.slice(1).trim()}`;
    return ` + ${s}`;
  }).join('');
}

// Partie littérale d'un monôme simple, pour les explications
export const lettersOf = key => Object.entries(monoOf(key)).map(([v, e]) => (e === 1 ? v : `${v}^${e}`)).join('');

export const gcdInt = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// tire des entiers jusqu'à ce qu'ils soient premiers entre eux
export function coprime(r, gens) {
  for (;;) {
    const vals = gens.map(g => g());
    if (vals.reduce((g, v) => gcdInt(g, v), 0) === 1) return vals;
  }
}
