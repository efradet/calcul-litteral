// Moteur algébrique : lecture des expressions tapées par l'élève, polynômes à
// coefficients rationnels, et vérification de la forme (développée réduite, factorisée).

// ---------- Nombres rationnels ----------
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
export function Q(n, d = 1) {
  if (d === 0) throw new Error('division par zéro');
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  return {n: n / g, d: d / g};
}
const qadd = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
const qmul = (a, b) => Q(a.n * b.n, a.d * b.d);
const qneg = a => Q(-a.n, a.d);
const qinv = a => Q(a.d, a.n);
const qeq = (a, b) => a.n === b.n && a.d === b.d;
const ZERO = Q(0), ONE = Q(1);

function decimalToQ(text) {
  const [i, f = ''] = text.split('.');
  const d = 10 ** f.length;
  return Q(parseInt(i + f, 10), d);
}

// Exposant maximal accepté à la saisie (au-delà, les calculs deviennent trop lourds pour être utiles)
export const MAX_EXPONENT = 50;

// ---------- Erreurs de lecture ----------
export class ParseError extends Error {
  constructor(message, pos) { super(message); this.pos = pos; }
}

// ---------- Lecture (tokenizer + parser) ----------
const SUPERSCRIPTS = {'⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9'};

export function normalizeInput(src) {
  let s = String(src);
  s = s.replace(/[−–—]/g, '-').replace(/[×·⋅•∙]/g, '*').replace(/÷/g, '/');
  s = s.replace(/(\d),(\d)/g, '$1.$2');
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => '^' + [...m].map(c => SUPERSCRIPTS[c]).join(''));
  s = s.replace(/\*\*/g, '^');
  return s;
}

function tokenize(src) {
  const s = normalizeInput(src);
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/\d|\./.test(c)) {
      let j = i;
      while (j < s.length && /[\d.]/.test(s[j])) j++;
      const text = s.slice(i, j);
      if ((text.match(/\./g) || []).length > 1 || text === '.') throw new ParseError(`Nombre mal écrit « ${text} »`, i);
      tokens.push({t: 'num', v: text, pos: i});
      i = j; continue;
    }
    if (/[a-zA-Z]/.test(c)) { tokens.push({t: 'var', v: c.toLowerCase(), pos: i}); i++; continue; }
    if ('+-*/^'.includes(c)) { tokens.push({t: c, pos: i}); i++; continue; }
    if ('([{'.includes(c)) { tokens.push({t: '(', v: c, pos: i}); i++; continue; }
    if (')]}'.includes(c)) { tokens.push({t: ')', v: c, pos: i}); i++; continue; }
    throw new ParseError(`Symbole non reconnu « ${c} »`, i);
  }
  return tokens;
}

export function parse(src) {
  const tokens = tokenize(src);
  if (!tokens.length) throw new ParseError('Écris une expression.', 0);
  let k = 0;
  const peek = () => tokens[k];
  const next = () => tokens[k++];
  const startsFactor = tok => tok && (tok.t === 'num' || tok.t === 'var' || tok.t === '(');

  function parseExpr() {
    const terms = [];
    let sign = 1;
    if (peek() && (peek().t === '-' || peek().t === '+')) { sign = next().t === '-' ? -1 : 1; }
    terms.push({sign, node: parseTerm()});
    while (peek() && (peek().t === '+' || peek().t === '-')) {
      const s = next().t === '-' ? -1 : 1;
      if (!peek()) throw new ParseError('L’expression se termine par un signe.', tokens[k - 1].pos);
      terms.push({sign: s, node: parseTerm()});
    }
    return terms.length === 1 && terms[0].sign === 1 ? terms[0].node : {type: 'add', terms};
  }
  function parseTerm() {
    const factors = [parseSigned()];
    const explicit = [];
    for (;;) {
      const tok = peek();
      if (tok && tok.t === '*') {
        next();
        if (!peek()) throw new ParseError('Il manque quelque chose après le signe de multiplication.', tok.pos);
        factors.push(parseSigned()); explicit.push(true);
      } else if (tok && tok.t === '/') {
        next();
        if (!peek()) throw new ParseError('Il manque le diviseur.', tok.pos);
        const right = parsePower();
        const left = factors.pop();
        factors.push({type: 'div', left, right});
      } else if (startsFactor(tok)) {
        factors.push(parsePower()); explicit.push(false);
      } else break;
    }
    return factors.length === 1 ? factors[0] : {type: 'mul', factors, explicit};
  }
  function parseSigned() {
    const tok = peek();
    if (tok && tok.t === '-') { next(); return {type: 'neg', node: parseSigned()}; }
    if (tok && tok.t === '+') { next(); return parseSigned(); }
    return parsePower();
  }
  function parsePower() {
    const base = parseAtom();
    if (peek() && peek().t === '^') {
      const caret = next();
      // exposant : un entier, éventuellement entre parenthèses (x^10, x^(10))
      let e = next();
      const paren = e && e.t === '(';
      if (paren) e = next();
      if (!e || e.t !== 'num' || e.v.includes('.')) throw new ParseError('Après ^, écris l’exposant : un nombre entier (par exemple x^4 ou x^10).', caret.pos);
      if (paren) { const c = next(); if (!c || c.t !== ')') throw new ParseError('Il manque une parenthèse fermante après l’exposant.', caret.pos); }
      const exp = parseInt(e.v, 10);
      if (exp > MAX_EXPONENT) throw new ParseError(`Exposant trop grand (maximum ${MAX_EXPONENT}).`, e.pos);
      return {type: 'pow', base, exp};
    }
    return base;
  }
  function parseAtom() {
    const tok = next();
    if (!tok) throw new ParseError('L’expression est incomplète.', src.length);
    if (tok.t === 'num') return {type: 'num', value: decimalToQ(tok.v), raw: tok.v};
    if (tok.t === 'var') return {type: 'var', name: tok.v};
    if (tok.t === '(') {
      if (peek() && peek().t === ')') throw new ParseError('Parenthèses vides.', tok.pos);
      const inner = parseExpr();
      const close = next();
      if (!close || close.t !== ')') throw new ParseError('Il manque une parenthèse fermante.', tok.pos);
      return {type: 'group', node: inner, bracket: tok.v};
    }
    if (tok.t === ')') throw new ParseError('Parenthèse fermante en trop.', tok.pos);
    throw new ParseError(`Signe « ${tok.t} » mal placé.`, tok.pos);
  }

  const ast = parseExpr();
  if (k < tokens.length) {
    const tok = tokens[k];
    throw new ParseError(tok.t === ')' ? 'Parenthèse fermante en trop.' : `Je ne comprends pas la suite à partir de « ${tok.v || tok.t} ».`, tok.pos);
  }
  return ast;
}

// ---------- Polynômes ----------
// Un polynôme est une Map : clé de monôme -> coefficient rationnel. Clé : "x^2*y", "" pour la constante.
const keyOf = mono => Object.keys(mono).filter(v => mono[v]).sort().map(v => (mono[v] === 1 ? v : `${v}^${mono[v]}`)).join('*');
export function monoOf(key) {
  const m = {};
  if (!key) return m;
  for (const part of key.split('*')) { const [v, e] = part.split('^'); m[v] = e ? parseInt(e, 10) : 1; }
  return m;
}
const clean = p => { for (const [k, c] of p) if (c.n === 0) p.delete(k); return p; };
export const pconst = q => clean(new Map([['', q]]));
export const pvar = v => new Map([[v, ONE]]);
export function padd(a, b) {
  const r = new Map(a);
  for (const [k, c] of b) r.set(k, r.has(k) ? qadd(r.get(k), c) : c);
  return clean(r);
}
export const pneg = a => new Map([...a].map(([k, c]) => [k, qneg(c)]));
export const psub = (a, b) => padd(a, pneg(b));
export function pmul(a, b) {
  let r = new Map();
  for (const [ka, ca] of a) for (const [kb, cb] of b) {
    const m = monoOf(ka);
    for (const [v, e] of Object.entries(monoOf(kb))) m[v] = (m[v] || 0) + e;
    r = padd(r, new Map([[keyOf(m), qmul(ca, cb)]]));
  }
  return clean(r);
}
export function ppow(a, e) { let r = pconst(ONE); for (let i = 0; i < e; i++) r = pmul(r, a); return r; }
export function peq(a, b) {
  const d = psub(a, b);
  return d.size === 0;
}
export const isConst = p => p.size === 0 || (p.size === 1 && p.has(''));
export const constValue = p => p.get('') || ZERO;
export const degreeOf = key => Object.values(monoOf(key)).reduce((s, e) => s + e, 0);
export const polyDegree = p => Math.max(0, ...[...p.keys()].map(degreeOf));
export const variablesOf = p => [...new Set([...p.keys()].flatMap(k => Object.keys(monoOf(k))))].sort();

export function toPoly(ast) {
  switch (ast.type) {
    case 'num': return pconst(ast.value);
    case 'var': return pvar(ast.name);
    case 'group': return toPoly(ast.node);
    case 'neg': return pneg(toPoly(ast.node));
    case 'pow': return ppow(toPoly(ast.base), ast.exp);
    case 'add': return ast.terms.reduce((acc, t) => padd(acc, t.sign < 0 ? pneg(toPoly(t.node)) : toPoly(t.node)), new Map());
    case 'mul': return ast.factors.reduce((acc, f) => pmul(acc, toPoly(f)), pconst(ONE));
    case 'div': {
      const d = toPoly(ast.right);
      if (!isConst(d)) throw new ParseError('On ne divise que par un nombre ici.', 0);
      if (constValue(d).n === 0) throw new ParseError('Division par zéro.', 0);
      return pmul(toPoly(ast.left), pconst(qinv(constValue(d))));
    }
    default: throw new Error('nœud inconnu ' + ast.type);
  }
}

export const polyOf = src => toPoly(parse(src));
export const equivalent = (a, b) => peq(polyOf(a), polyOf(b));

// ---------- Ordre et écriture des polynômes ----------
function compareKeys(a, b) {
  const da = degreeOf(a), db = degreeOf(b);
  if (da !== db) return db - da;
  const ma = monoOf(a), mb = monoOf(b);
  const vars = [...new Set([...Object.keys(ma), ...Object.keys(mb)])].sort();
  for (const v of vars) { const d = (mb[v] || 0) - (ma[v] || 0); if (d) return d; }
  return 0;
}
const qToSource = q => (q.d === 1 ? String(q.n) : `${q.n}/${q.d}`);
export function polyToSource(p) {
  const keys = [...p.keys()].sort(compareKeys);
  if (!keys.length) return '0';
  return keys.map((k, i) => {
    const c = p.get(k);
    const neg = c.n < 0;
    const abs = Q(Math.abs(c.n), c.d);
    let body;
    if (!k) body = qToSource(abs);
    else if (abs.n === 1 && abs.d === 1) body = k.replace(/\*/g, '');
    else body = qToSource(abs) + k.replace(/\*/g, '');
    return (i === 0 ? (neg ? '-' : '') : neg ? ' - ' : ' + ') + body;
  }).join('');
}

// ---------- LaTeX qui respecte l'écriture d'origine ----------
const qToLatex = q => (q.d === 1 ? String(q.n) : `\\frac{${Math.abs(q.n)}}{${q.d}}`);
function numLatex(node) {
  if (node.raw && node.raw.includes('.')) return node.raw.replace('.', '{,}');
  return qToLatex(node.value);
}
const startsWithNumber = node => node.type === 'num' || node.type === 'div' || (node.type === 'pow' && node.base.type === 'num') ||
  (node.type === 'mul' && startsWithNumber(node.factors[0]));

export function toLatex(node) {
  switch (node.type) {
    case 'num': return numLatex(node);
    case 'var': return node.name;
    case 'group': {
      const [l, r] = node.bracket === '[' ? ['[', ']'] : node.bracket === '{' ? ['\\{', '\\}'] : ['(', ')'];
      return `\\left${l}${toLatex(node.node)}\\right${r}`;
    }
    case 'neg': return '-' + (node.node.type === 'add' ? `\\left(${toLatex(node.node)}\\right)` : toLatex(node.node));
    case 'pow': {
      const b = node.base;
      const base = b.type === 'var' || b.type === 'group' || (b.type === 'num' && b.value.n >= 0 && b.value.d === 1) ? toLatex(b) : `\\left(${toLatex(b)}\\right)`;
      return `${base}^{${node.exp}}`;
    }
    case 'div': {
      const unwrap = n => (n.type === 'group' ? n.node : n);
      return `\\frac{${toLatex(unwrap(node.left))}}{${toLatex(unwrap(node.right))}}`;
    }
    case 'mul': return node.factors.map((f, i) => {
      const s = f.type === 'add' ? `\\left(${toLatex(f)}\\right)` : toLatex(f);
      if (i === 0) return s;
      const needDot = node.explicit[i - 1] || startsWithNumber(f) || f.type === 'neg';
      return (needDot ? ' \\cdot ' : '') + s;
    }).join('');
    case 'add': return node.terms.map((t, i) => {
      const s = toLatex(t.node);
      if (i === 0) return (t.sign < 0 ? '-' : '') + s;
      return (t.sign < 0 ? ' - ' : ' + ') + s;
    }).join('');
    default: return '?';
  }
}
export const latexOf = src => toLatex(parse(src));

// ---------- Vérification de la forme ----------
// Développé et réduit : somme de monômes, sans parenthèses, chaque type de monôme une seule fois.
function monomialInfo(node) {
  // Renvoie {key} si node est un monôme écrit simplement (coefficient au plus une fois, chaque lettre une fois), sinon null.
  let n = node, coefCount = 0;
  if (n.type === 'neg') { n = n.node; }
  const factors = n.type === 'mul' ? n.factors : [n];
  const seen = new Set();
  for (const f of factors) {
    if (f.type === 'num' || (f.type === 'div' && f.left.type === 'num' && f.right.type === 'num')) { coefCount++; continue; }
    if (f.type === 'var') { if (seen.has(f.name)) return null; seen.add(f.name); continue; }
    if (f.type === 'pow' && f.base.type === 'var') { if (seen.has(f.base.name) || f.exp < 1) return null; seen.add(f.base.name); continue; }
    return null;
  }
  if (coefCount > 1) return null;
  const p = toPoly(node);
  if (p.size === 0) return {key: null, zero: true};
  return {key: [...p.keys()][0]};
}

export function isExpandedReduced(ast) {
  const terms = ast.type === 'add' ? ast.terms.map(t => t.node) : [ast];
  const keys = new Set();
  for (const t of terms) {
    const info = monomialInfo(t);
    if (!info) return false;
    if (info.zero) return terms.length === 1;
    if (keys.has(info.key)) return false;
    keys.add(info.key);
  }
  return true;
}

// Contenu commun (nombre entier et lettres) des termes d'un polynôme.
export function commonContent(p) {
  const entries = [...p.entries()];
  if (entries.length < 2) return {number: 1, letters: {}};
  let g = 0, integral = true;
  for (const [, c] of entries) { if (c.d !== 1) integral = false; g = gcd(g, c.n); }
  const monos = entries.map(([k]) => monoOf(k));
  const letters = {};
  for (const v of Object.keys(monos[0])) {
    const e = Math.min(...monos.map(m => m[v] || 0));
    if (e > 0) letters[v] = e;
  }
  return {number: integral ? g : 1, letters};
}

const isSquareInt = n => n >= 0 && Number.isInteger(Math.sqrt(n));
function isPerfectSquareMonomial(key, c) {
  if (c.d !== 1 || !isSquareInt(Math.abs(c.n))) return false;
  return Object.values(monoOf(key)).every(e => e % 2 === 0);
}
// Un facteur peut-il encore se factoriser (identité remarquable ou trinôme à racines entières) ?
export function stillFactorable(p) {
  const entries = [...p.entries()];
  const vars = variablesOf(p);
  if (entries.length === 2) {
    const [[k1, c1], [k2, c2]] = entries;
    if (Math.sign(c1.n) !== Math.sign(c2.n) && isPerfectSquareMonomial(k1, c1) && isPerfectSquareMonomial(k2, c2) && (k1 || k2)) return true;
  }
  if (vars.length === 1 && polyDegree(p) === 2) {
    const v = vars[0];
    const a = p.get(`${v}^2`) || ZERO, b = p.get(v) || ZERO, c = p.get('') || ZERO;
    if (a.d !== 1 || b.d !== 1 || c.d !== 1 || c.n === 0) return false;
    const disc = b.n * b.n - 4 * a.n * c.n;
    if (disc < 0 || !isSquareInt(disc)) return false;
    // racines rationnelles : on accepte aussi si a divise bien, sinon le facteur reste « entier » factorisable
    return true;
  }
  return false;
}

function flattenProduct(ast, out = []) {
  if (ast.type === 'neg') return flattenProduct(ast.node, out);
  if (ast.type === 'group') return flattenProduct(ast.node, out);
  if (ast.type === 'mul') { ast.factors.forEach(f => flattenProduct(f, out)); return out; }
  if (ast.type === 'pow') { for (let i = 0; i < ast.exp; i++) flattenProduct(ast.base, out); return out; }
  out.push(ast);
  return out;
}

// Renvoie {ok:true} ou {ok:false, reason}
export function factoredCheck(ast) {
  let top = ast;
  while (top.type === 'neg' || (top.type === 'group')) top = top.node;
  if (top.type === 'add') return {ok: false, reason: 'notProduct'};
  const factors = flattenProduct(top);
  const polys = factors.map(toPoly).filter(p => !isConst(p));
  const sums = polys.filter(p => p.size >= 2);
  if (!sums.length && polys.length < 2) return {ok: false, reason: 'notProduct'};
  for (const p of sums) {
    const cc = commonContent(p);
    if (cc.number > 1) return {ok: false, reason: 'commonNumber', detail: cc.number};
    if (Object.keys(cc.letters).length) return {ok: false, reason: 'commonLetter', detail: Object.keys(cc.letters)[0]};
    if (stillFactorable(p)) return {ok: false, reason: 'stillFactorable', detail: polyToSource(p)};
  }
  return {ok: true};
}

// ---------- Correction d'une réponse ----------
// type : 'expanded' (développé réduit), 'factored', 'equivalent' (toute forme égale), 'number'
const UNIT = /\s*(cm²|cm2|m²|m2|cm|mm²|mm|km|m|fr\.?|francs?|chf)\s*$/i;

export function checkAnswer(input, expected, type) {
  const text = String(input || '').trim();
  if (!text) return {status: 'empty'};
  let ast, poly;
  try {
    ast = parse(type === 'number' ? text.replace(UNIT, '') : text);
    poly = toPoly(ast);
  } catch (e) {
    return {status: 'error', message: e instanceof ParseError ? e.message : 'Expression illisible.'};
  }
  const target = polyOf(expected);
  if (!peq(poly, target)) return {status: 'wrong', hint: diagnose(poly, target)};
  if (type === 'number' && !isConst(poly)) return {status: 'wrong'};
  if (type === 'expanded' && !isExpandedReduced(ast)) return {status: 'form', message: 'C’est égal, mais ce n’est pas encore développé et réduit.'};
  if (type && type.startsWith('multiple:')) {
    const k = parseInt(type.split(':')[1], 10);
    if (!isMultipleForm(ast, k)) return {status: 'form', message: `C’est égal, mais écris-le sous la forme ${k} · (…) pour montrer que c’est un multiple de ${k}.`};
  }
  if (type === 'factored') {
    const f = factoredCheck(ast);
    if (!f.ok) {
      const messages = {
        notProduct: 'C’est égal, mais ce n’est pas un produit : il faut factoriser.',
        commonNumber: `C’est égal, mais on peut encore mettre ${f.detail} en évidence.`,
        commonLetter: `C’est égal, mais on peut encore mettre ${f.detail} en évidence.`,
        stillFactorable: 'C’est égal, mais un des facteurs peut encore se factoriser.'
      };
      return {status: 'form', message: messages[f.reason]};
    }
  }
  return {status: 'right'};
}

// k · (expression à coefficients entiers), dans n'importe quel ordre
export function isMultipleForm(ast, k) {
  let top = ast;
  while (top.type === 'group') top = top.node;
  if (top.type !== 'mul') return false;
  let coef = Q(1);
  const rest = [];
  for (const f of top.factors) {
    const p = toPoly(f);
    if (isConst(p)) coef = qmul(coef, constValue(p)); else rest.push(p);
  }
  if (coef.d !== 1 || coef.n % k !== 0 || !rest.length) return false;
  return rest.every(p => [...p.values()].every(c => c.d === 1));
}

function diagnose(poly, target) {
  if (poly.size === target.size && [...target].every(([k, c]) => poly.has(k) && Math.abs(poly.get(k).n) === Math.abs(c.n) && poly.get(k).d === c.d)) return 'Les nombres sont bons : vérifie les signes.';
  const missing = [...target.keys()].filter(k => !poly.has(k));
  if (missing.length === 1 && poly.size === target.size - 1 && [...poly].every(([k, c]) => target.has(k) && qeq(target.get(k), c))) {
    return 'Il manque un terme.';
  }
  return null;
}

// Pour l'aperçu de saisie : LaTeX de ce que l'élève a tapé, ou null
export function previewLatex(input) {
  try { return toLatex(parse(input)); } catch { return null; }
}
