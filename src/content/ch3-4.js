// Chapitre 3 : Identités remarquables. Chapitre 4 : Factorisation.
import {polyOf, commonContent, latexOf, stillFactorable} from '../algebra.js';
import {S, lin, quad, wrap, termsOf, opposite, joinTerms, dedupe, productSteps, coprime, gcdInt} from './helpers.js';

// monôme "k·v" écrit proprement ; k peut valoir 1
const mono = (k, v) => S(`${k}*${v}`);
const sq = m => (/^\d+$/.test(m) || /^[a-z]$/.test(m) ? `${m}^2` : `(${m})^2`);

// ---------- Développements par identité ----------
// type : 'plus' (a+b)², 'minus' (a−b)², 'conj' (a+b)(a−b)
function identityExpand(r, type, a, b) {
  const prompt = type === 'plus' ? `(${a} + ${b})^2` : type === 'minus' ? `(${a} - ${b})^2` : `(${a} + ${b})(${a} - ${b})`;
  const formula = type === 'plus' ? '(a + b)² = a² + 2ab + b²' : type === 'minus' ? '(a − b)² = a² − 2ab + b²' : '(a + b)(a − b) = a² − b²';
  const sub = type === 'plus' ? `${sq(a)} + 2*${a}*${b} + ${sq(b)}` : type === 'minus' ? `${sq(a)} - 2*${a}*${b} + ${sq(b)}` : `${sq(a)} - ${sq(b)}`;
  return {
    kind: 'expr', prompt, answer: S(prompt), check: 'expanded', identity: type,
    hint: type === 'conj' ? 'Utilise (a + b)(a − b) = a² − b². Il n’y a pas de terme du milieu.' : `Utilise ${formula}. N’oublie pas le double produit 2ab.`,
    steps: [{src: sub, note: `${formula}, avec a = ${a.replace(/\*/g, '')} et b = ${b.replace(/\*/g, '')}.`}, {src: S(prompt)}]
  };
}
const pickId = r => r.pick(['plus', 'minus', 'conj']);

// Complète : (x + 5)² = x² + □ + 25
function fillBlank(r) {
  const k = r.int(2, 9), type = r.pick(['plus', 'minus']);
  const sign = type === 'plus' ? '+' : '-';
  const which = r.pick(['middle', 'last']);
  const middle = `${2 * k}x`, last = String(k * k);
  const tex = which === 'middle'
    ? `(x ${sign} ${k})^{2} = x^{2} ${sign} \\square + ${k * k}`
    : `(x ${sign} ${k})^{2} = x^{2} ${sign} ${2 * k}x + \\square`;
  return {
    kind: 'expr', promptTex: tex, answer: which === 'middle' ? middle : last, check: 'equivalent',
    hint: which === 'middle' ? 'Le terme du milieu est le double produit : 2 · x · ' + k + '.' : `Le dernier terme est le carré de ${k}.`,
    steps: [{src: which === 'middle' ? `2*x*${k}` : `${k}^2`, note: which === 'middle' ? 'Double produit 2ab.' : 'Carré du second terme b².'}, {src: which === 'middle' ? middle : last}]
  };
}

// ---------- Factorisations par identité ----------
function identityFactor(r, type, a, b) {
  const expanded = type === 'plus' ? `(${a}+${b})^2` : type === 'minus' ? `(${a}-${b})^2` : `(${a}+${b})*(${a}-${b})`;
  const prompt = S(expanded);
  const answer = type === 'plus' ? `(${a} + ${b})^2` : type === 'minus' ? `(${a} - ${b})^2` : `(${a} - ${b})(${a} + ${b})`;
  const A = a.replace(/\*/g, ''), B = b.replace(/\*/g, '');
  const note = type === 'conj'
    ? `Différence de deux carrés : ${S(sq(a))} = (${A})² et ${S(sq(b))} = (${B})². On utilise a² − b² = (a − b)(a + b).`
    : `Trinôme carré parfait : (${A})², (${B})² et le double produit 2 · ${A} · ${B} = ${S(`2*${a}*${b}`)}.`;
  return {
    kind: 'expr', prompt, answer, check: 'factored',
    hint: type === 'conj' ? 'Deux carrés séparés par un signe − : pense à a² − b² = (a − b)(a + b).' : 'Trois termes dont deux carrés : vérifie si le terme du milieu est le double produit.',
    steps: [{src: type === 'conj' ? `${sq(a)} - ${sq(b)}` : `${sq(a)} ${type === 'plus' ? '+' : '-'} 2*${a}*${b} + ${sq(b)}`, note}, {src: answer}]
  };
}

function coprimeIdentity(r, type, ra, rb, letterB) {
  const [k, c] = coprime(r, [() => r.int(...ra), () => r.int(...rb)]);
  return identityFactor(r, type, `${k}x`, letterB ? (c === 1 ? letterB : `${c}${letterB}`) : String(c));
}

// Calcul astucieux : 101², 99·101, 49²
function mentalCalc(r) {
  const kind = r.pick(['sq+', 'sq-', 'conj']);
  const base = r.pick([20, 30, 40, 50, 60, 70, 100]), d = r.int(1, 3);
  if (kind === 'sq+') {
    const n = base + d;
    return {kind: 'expr', text: `Calcule {{${n}^2}} sans calculatrice, à l’aide d’une identité remarquable.`, answer: String(n * n), check: 'number', from: `${n}^2`,
      hint: `Écris ${n} = ${base} + ${d}.`, steps: [{src: `(${base} + ${d})^2`}, {src: `${base}^2 + 2*${base}*${d} + ${d}^2`, note: '(a + b)² = a² + 2ab + b²'}, {src: `${base * base} + ${2 * base * d} + ${d * d}`}, {src: String(n * n)}]};
  }
  if (kind === 'sq-') {
    const n = base - d;
    return {kind: 'expr', text: `Calcule {{${n}^2}} sans calculatrice, à l’aide d’une identité remarquable.`, answer: String(n * n), check: 'number', from: `${n}^2`,
      hint: `Écris ${n} = ${base} − ${d}.`, steps: [{src: `(${base} - ${d})^2`}, {src: `${base}^2 - 2*${base}*${d} + ${d}^2`, note: '(a − b)² = a² − 2ab + b²'}, {src: `${base * base} - ${2 * base * d} + ${d * d}`}, {src: String(n * n)}]};
  }
  return {kind: 'expr', text: `Calcule {{${base - d}*${base + d}}} sans calculatrice, à l’aide d’une identité remarquable.`, answer: String((base - d) * (base + d)), check: 'number', from: `${base - d}*${base + d}`,
    hint: `Écris ces nombres comme ${base} − ${d} et ${base} + ${d}.`, steps: [{src: `(${base} - ${d})(${base} + ${d})`}, {src: `${base}^2 - ${d}^2`, note: '(a − b)(a + b) = a² − b²'}, {src: `${base * base} - ${d * d}`}, {src: String((base - d) * (base + d))}]};
}

// Différences d'identités : (2x+3)² − (x−1)² etc.
function identityCombo(r) {
  const kind = r.int(1, 3);
  let first, second, sign = -1;
  if (kind === 1) { first = `(${lin(r.int(2, 3), r.nz(-5, 5))})^2`; second = `(${lin(1, r.nz(-5, 5))})^2`; }
  else if (kind === 2) { const c = r.int(1, 6); first = `(x + ${c})^2`; second = `(x + ${c})(x - ${c})`; }
  else { first = `(${lin(r.int(2, 4), r.nz(-4, 4))})^2`; const c = r.int(1, 5); second = `2(x + ${c})(x - ${c})`; }
  const prompt = `${first} ${sign < 0 ? '-' : '+'} ${second}`;
  const e1 = S(first), e2 = S(second);
  return {
    kind: 'expr', prompt, answer: S(prompt), check: 'expanded',
    hint: 'Développe chaque morceau avec une identité, garde le résultat entre parenthèses, puis enlève-les avec soin.',
    steps: dedupe([{src: `(${e1}) - (${e2})`, note: 'On développe chaque morceau à l’aide des identités.'}, {src: joinTerms([...termsOf(e1), ...termsOf(opposite(e2))]), note: 'On enlève les parenthèses.'}, {src: S(prompt), note: 'On réduit.'}])
  };
}

// (x + p)² − q² = (x + p − q)(x + p + q)
function diffSquaresBinomial(r) {
  const p = r.nz(-5, 5), q = r.int(1, 6);
  const inner = lin(1, p);
  const prompt = `(${inner})^2 - ${q * q}`;
  const answer = `(${lin(1, p - q)})(${lin(1, p + q)})`;
  return {
    kind: 'expr', prompt, answer, check: 'factored',
    hint: `${q * q} = ${q}². C’est une différence de deux carrés : A² − B² = (A − B)(A + B), avec A = ${inner}.`,
    steps: [{src: `(${inner})^2 - ${q}^2`, note: `${q * q} = ${q}²`}, {src: `((${inner}) - ${q})((${inner}) + ${q})`, note: 'A² − B² = (A − B)(A + B)'}, {src: answer, note: 'On réduit dans chaque parenthèse.'}]
  };
}

// Problème : carré de côté x + p dont on retire un carré de côté x
function squareFrameProblem(r) {
  const p = r.int(2, 6), xv = r.int(3, 9);
  const diff = `(x+${p})^2 - x^2`;
  const reduced = S(diff);
  const factored = `${2 * p}(${S(`x + ${p / 2}`)})`;
  const canHalve = p % 2 === 0;
  return {
    title: 'Problème',
    intro: `Un carré a un côté de {{x + ${p}}} cm. On découpe dans un coin un carré de côté {{x}} cm. On s’intéresse à l’aire de la partie restante (en couleur).`,
    figure: {type: 'squareMinusSquare', outer: `x+${p}`, inner: 'x', unit: 'cm'},
    items: [
      {kind: 'expr', text: 'Exprime l’aire de la partie colorée, sous forme développée réduite.', answer: reduced, from: diff, check: 'expanded', unit: 'cm²', hint: 'Aire du grand carré − aire du petit carré. Utilise (a + b)² pour le grand carré.', steps: [{src: diff, note: 'Grand carré − petit carré.'}, {src: `(${S(`(x+${p})^2`)}) - x^2`, note: '(a + b)² = a² + 2ab + b²'}, {src: reduced}]},
      {kind: 'expr', text: 'Factorise cette aire.', answer: canHalve ? factored : `${p}(2x + ${p})`, from: reduced, check: 'factored', hint: 'Cherche le plus grand nombre qui divise les deux termes.', steps: [{src: reduced}, {src: canHalve ? factored : `${p}(2x + ${p})`, note: 'Mise en évidence du facteur commun.'}]},
      {kind: 'expr', text: `Calcule cette aire pour {{x = ${xv}}}.`, answer: String((xv + p) ** 2 - xv * xv), from: `(${xv}+${p})^2-${xv}^2`, check: 'number', unit: 'cm²', hint: `Remplace x par ${xv} dans la forme la plus simple.`, steps: [{src: `${2 * p}*${xv} + ${p * p}`, note: `On remplace x par ${xv} dans ${reduced}.`}, {src: String((xv + p) ** 2 - xv * xv)}]}
    ]
  };
}

export const chapter3 = {
  id: 3,
  title: 'Identités remarquables',
  subtitle: 'Développer et factoriser avec les trois identités',
  rappel: [
    {tex: '(a + b)^{2} = a^{2} + 2ab + b^{2}', text: 'Carré d’une somme'},
    {tex: '(a - b)^{2} = a^{2} - 2ab + b^{2}', text: 'Carré d’une différence'},
    {tex: '(a + b)(a - b) = a^{2} - b^{2}', text: 'Produit d’une somme par une différence'},
    {tex: '(a + b)^{2} \\neq a^{2} + b^{2}', text: 'Erreur classique : ne pas oublier 2ab'}
  ],
  levels: {
    1: r => [
      {title: 'Développe à l’aide des identités remarquables.', items: [
        identityExpand(r, 'plus', 'x', String(r.int(2, 9))), identityExpand(r, 'minus', 'x', String(r.int(2, 9))), identityExpand(r, 'conj', 'x', String(r.int(2, 9))),
        identityExpand(r, 'plus', r.pick(['a', 'y']), String(r.int(1, 6))), identityExpand(r, 'minus', r.pick(['a', 'y']), String(r.int(1, 6))), identityExpand(r, 'conj', r.pick(['a', 'y']), String(r.int(1, 9)))
      ]},
      {title: 'Complète.', items: [fillBlank(r), fillBlank(r), fillBlank(r)]},
      {title: 'Calcul mental astucieux', items: [mentalCalc(r), mentalCalc(r)]}
    ],
    2: r => [
      {title: 'Développe et réduis.', items: [
        identityExpand(r, 'plus', `${r.int(2, 5)}x`, String(r.int(1, 7))), identityExpand(r, 'minus', `${r.int(2, 5)}x`, String(r.int(1, 7))),
        identityExpand(r, 'conj', `${r.int(2, 6)}x`, String(r.int(1, 9))), identityExpand(r, pickId(r), `${r.int(2, 3)}x`, `${r.int(1, 4)}y`)
      ]},
      {title: 'Factorise à l’aide d’une identité remarquable.', items: [
        identityFactor(r, 'plus', 'x', String(r.int(2, 9))), identityFactor(r, 'conj', 'x', String(r.int(2, 9))),
        identityFactor(r, 'minus', 'x', String(r.int(2, 9))), coprimeIdentity(r, 'conj', [2, 5], [1, 7], '')
      ]},
      {title: 'Calcul mental astucieux', items: [mentalCalc(r), mentalCalc(r), mentalCalc(r)]}
    ],
    3: r => [
      {title: 'Factorise.', items: [
        coprimeIdentity(r, 'minus', [2, 5], [1, 5], ''), coprimeIdentity(r, 'conj', [2, 6], [1, 7], 'y'),
        coprimeIdentity(r, 'plus', [2, 4], [1, 5], 'y'), diffSquaresBinomial(r)
      ]},
      {title: 'Développe et réduis.', items: [identityCombo(r), identityCombo(r), identityCombo(r)]},
      squareFrameProblem(r)
    ]
  }
};

// ======================= CHAPITRE 4 =======================
// Mise en évidence : k·m·(A) écrit développé, on retrouve le facteur commun
function commonFactor(r, level = 1) {
  const v = 'x';
  let factor, inner;
  if (level === 1) {
    const k = r.int(2, 9), useX = r.next() < 0.4;
    factor = useX ? mono(k, v) : String(k);
    const [a, b] = coprime(r, [() => r.int(1, 7), () => r.nz(-9, 9)]);
    inner = lin(a, b);
  } else {
    const k = r.int(2, 6), e = r.int(1, 2);
    factor = S(`${k}*${v}^${e}`);
    do {
      const [a, b, c] = coprime(r, [() => r.nz(-4, 4), () => r.nz(-6, 6), () => r.nz(-7, 7)]);
      inner = quad(a, b, c);
    } while (stillFactorable(polyOf(inner)));
  }
  // facteur intérieur sans contenu commun : on évite un pgcd caché
  const prompt = S(`(${factor})*(${inner})`);
  const pieces = termsOf(inner).map(t => `${factor}*${t.startsWith('-') ? `(${t})` : t}`).join(' + ');
  return {
    kind: 'expr', prompt, answer: `${factor}(${inner})`, check: 'factored',
    hint: 'Cherche le plus grand nombre qui divise tous les coefficients, et les lettres présentes dans tous les termes (avec le plus petit exposant).',
    steps: [{src: pieces, note: `Le facteur commun est ${factor.replace(/\^(\d)/, '^$1')}.`}, {src: `${factor}(${inner})`}]
  };
}
function lettersFactor(r) {
  const k = r.int(2, 7), [a, b] = coprime(r, [() => r.int(1, 5), () => r.nz(-6, 6)]);
  const factor = `${k}a`;
  const inner = S(`${a}b + (${b})`);
  const prompt = S(`(${factor})*(${inner})`);
  return {kind: 'expr', prompt, answer: `${factor}(${inner})`, check: 'factored', hint: 'Les deux termes contiennent la lettre a. Le nombre commun aussi peut être mis en évidence.', steps: [{src: termsOf(inner).map(t => `${factor}*${t.startsWith('-') ? `(${t})` : t}`).join(' + '), note: `Le facteur commun est ${factor}.`}, {src: `${factor}(${inner})`}]};
}
function fillFactor(r) {
  const k = r.int(2, 8), inner = lin(r.int(1, 5), r.nz(-9, 9));
  const expanded = S(`${k}*(${inner})`);
  return {kind: 'expr', promptTex: `${latexOf(expanded)} = ${k}\\,(\\;\\square\\;)`, answer: inner, check: 'equivalent', hint: `Divise chaque terme par ${k}.`, steps: [{tex: `${latexOf(expanded)} = ${k}\\,(${latexOf(inner)})`, note: `On divise chaque terme par ${k}.`}, {src: inner}]};
}

// Facteur commun entre parenthèses : a(B) + c(B)
function bracketFactor(r) {
  const B = lin(1, r.nz(-7, 7));
  const [ka, c] = coprime(r, [() => r.pick([1, r.int(2, 5)]), () => r.nz(-7, 7)]);
  const a = ka === 1 ? 'x' : `${ka}x`;
  const prompt = `${a}(${B}) ${c < 0 ? '-' : '+'} ${Math.abs(c)}(${B})`;
  const second = lin(ka, c);
  return {
    kind: 'expr', prompt, answer: `(${B})(${second})`, check: 'factored',
    hint: `La parenthèse (${B}) apparaît dans les deux termes : c’est elle le facteur commun.`,
    steps: [{src: prompt, note: `Facteur commun : (${B}).`}, {src: `(${B})(${a} ${c < 0 ? '-' : '+'} ${Math.abs(c)})`}, {src: `(${B})(${second})`}]
  };
}

// Trinôme unitaire x² + sx + p = (x + m)(x + n)
function unitTrinomial(r) {
  let m, n;
  do { m = r.nz(-9, 9); n = r.nz(-9, 9); } while (m + n === 0 || m === n);
  const prompt = S(`(x+(${m}))*(x+(${n}))`);
  const answer = `(${lin(1, m)})(${lin(1, n)})`;
  return {
    kind: 'expr', prompt, answer, check: 'factored',
    hint: `Cherche deux nombres dont la somme vaut ${m + n} et le produit ${m * n}.`,
    steps: [{text: `On cherche deux nombres de somme ${m + n} et de produit ${m * n} : ce sont ${m} et ${n}.`}, {src: answer, note: 'x² + sx + p = (x + m)(x + n) avec m + n = s et m · n = p.'}]
  };
}

// Factoriser complètement : mise en évidence puis identité ou trinôme
function completeFactor(r, kind) {
  if (kind === 'diffSq') {
    const k = r.int(2, 5), c = r.int(1, 6);
    const prompt = S(`${k}*x^2 - ${k * c * c}`);
    return {kind: 'expr', prompt, answer: `${k}(x - ${c})(x + ${c})`, check: 'factored', hint: `Commence par mettre ${k} en évidence, puis regarde ce qui reste.`,
      steps: [{src: `${k}(x^2 - ${c * c})`, note: `Mise en évidence de ${k}.`}, {src: `${k}(x - ${c})(x + ${c})`, note: 'a² − b² = (a − b)(a + b)'}]};
  }
  if (kind === 'square') {
    const k = r.int(2, 5), c = r.nz(-5, 5);
    const prompt = S(`${k}*(x + (${c}))^2`);
    return {kind: 'expr', prompt, answer: `${k}(${lin(1, c)})^2`, check: 'factored', hint: `Mets ${k} en évidence : il reste un trinôme carré parfait.`,
      steps: [{src: `${k}(${S(`(x+(${c}))^2`)})`, note: `Mise en évidence de ${k}.`}, {src: `${k}(${lin(1, c)})^2`, note: c > 0 ? '(a + b)²' : '(a − b)²'}]};
  }
  if (kind === 'cubic') {
    const c = r.int(2, 7);
    const prompt = S(`x^3 - ${c * c}x`);
    return {kind: 'expr', prompt, answer: `x(x - ${c})(x + ${c})`, check: 'factored', hint: 'Commence par mettre x en évidence.',
      steps: [{src: `x(x^2 - ${c * c})`, note: 'Mise en évidence de x.'}, {src: `x(x - ${c})(x + ${c})`, note: 'a² − b² = (a − b)(a + b)'}]};
  }
  if (kind === 'trinomial') {
    const k = r.int(2, 5);
    let m, n;
    do { m = r.nz(-6, 6); n = r.nz(-6, 6); } while (m + n === 0 || m === n);
    const prompt = S(`${k}*(x+(${m}))*(x+(${n}))`);
    return {kind: 'expr', prompt, answer: `${k}(${lin(1, m)})(${lin(1, n)})`, check: 'factored', hint: `Mets d’abord ${k} en évidence, puis factorise le trinôme unitaire qui reste.`,
      steps: [{src: `${k}(${S(`(x+(${m}))*(x+(${n}))`)})`, note: `Mise en évidence de ${k}.`}, {text: `Somme ${m + n}, produit ${m * n} : les nombres ${m} et ${n}.`}, {src: `${k}(${lin(1, m)})(${lin(1, n)})`}]};
  }
  if (kind === 'xSquare') {
    const c = r.int(1, 6);
    const prompt = S(`x*(x - ${c})^2`);
    return {kind: 'expr', prompt, answer: `x(x - ${c})^2`, check: 'factored', hint: 'Mets x en évidence : il reste un trinôme carré parfait.',
      steps: [{src: `x(${S(`(x-${c})^2`)})`, note: 'Mise en évidence de x.'}, {src: `x(x - ${c})^2`, note: '(a − b)² = a² − 2ab + b²'}]};
  }
  // groupement : ax + ay + bx + by
  const p = r.int(2, 9);
  const prompt = `ax + ${p}a + bx + ${p}b`;
  return {kind: 'expr', prompt, answer: `(a + b)(x + ${p})`, check: 'factored', hint: 'Groupe les termes deux par deux : ceux avec a, puis ceux avec b.',
    steps: [{src: `a(x + ${p}) + b(x + ${p})`, note: 'On met a en évidence dans les deux premiers termes, b dans les deux derniers.'}, {src: `(x + ${p})(a + b)`, note: `Facteur commun : (x + ${p}).`}]};
}

function diffOfBinomialSquares(r) {
  const A = lin(r.int(2, 3), r.nz(-4, 4)), B = lin(1, r.nz(-5, 5));
  const minus = S(`(${A}) - (${B})`), plus = S(`(${A}) + (${B})`);
  const prompt = `(${A})^2 - (${B})^2`;
  const prodTxt = `(${minus})(${plus})`;
  // une parenthèse peut encore contenir un facteur numérique : on le sort
  const content = src => commonContent(polyOf(src)).number;
  const k1 = content(minus), k2 = content(plus), k = k1 * k2;
  const answer = k > 1 ? `${k}(${S(`(${minus})/${k1}`)})(${S(`(${plus})/${k2}`)})` : prodTxt;
  const steps = [{src: `((${A}) - (${B}))((${A}) + (${B}))`, note: 'A² − B² = (A − B)(A + B)'}, {src: prodTxt, note: 'On réduit dans chaque parenthèse.'}];
  if (k > 1) steps.push({src: answer, note: `On met encore ${k} en évidence.`});
  return {
    kind: 'expr', prompt, answer, check: 'factored',
    hint: 'C’est A² − B² avec A et B entre parenthèses : (A − B)(A + B). Réduis ensuite chaque parenthèse, et vérifie s’il reste un facteur commun.',
    steps
  };
}

function rectangleLengthProblem(r) {
  let m, n;
  do { m = r.int(1, 7); n = r.int(1, 7); } while (m === n);
  const area = S(`(x+${m})*(x+${n})`);
  return {
    title: 'Problème',
    intro: `L’aire d’un rectangle vaut {{${area}}} cm². Sa largeur mesure {{x + ${m}}} cm.`,
    figure: {type: 'rect', w: 1.7, h: 1, top: '?', right: `x+${m}`, unit: 'cm', center: area},
    items: [
      {kind: 'expr', text: 'Factorise l’aire.', prompt: area, answer: `(x + ${m})(x + ${n})`, check: 'factored', hint: `Trinôme unitaire : somme ${m + n}, produit ${m * n}.`, steps: [{text: `Somme ${m + n}, produit ${m * n} : les nombres ${m} et ${n}.`}, {src: `(x + ${m})(x + ${n})`}]},
      {kind: 'expr', text: 'Déduis-en la longueur du rectangle.', answer: `x + ${n}`, check: 'equivalent', unit: 'cm', hint: 'Aire = largeur × longueur : regarde l’autre facteur.', steps: [{src: `x + ${n}`, note: `L’aire est (x + ${m}) · (x + ${n}) et la largeur est x + ${m}.`}]},
      {kind: 'expr', text: 'Exprime le périmètre du rectangle, réduit.', answer: S(`2*(x+${m})+2*(x+${n})`), from: `2*(x+${m})+2*(x+${n})`, check: 'expanded', unit: 'cm', hint: 'Périmètre = 2 × largeur + 2 × longueur.', steps: [{src: `2(x + ${m}) + 2(x + ${n})`}, {src: S(`2*(x+${m})+2*(x+${n})`)}]}
    ]
  };
}

function boxVolumeProblem(r) {
  let m, n;
  do { m = r.int(1, 6); n = r.int(1, 6); } while (m === n);
  const vol = S(`x*(x+${m})*(x+${n})`);
  return {
    title: 'Problème',
    intro: `Le volume d’une boîte en forme de pavé droit vaut {{${vol}}} cm³. Ses trois dimensions sont des polynômes du premier degré en {{x}}.`,
    items: [
      {kind: 'expr', text: 'Factorise complètement le volume pour retrouver trois dimensions possibles.', prompt: vol, answer: `x(x + ${m})(x + ${n})`, check: 'factored', hint: 'Mets d’abord x en évidence, puis factorise le trinôme unitaire.', steps: [{src: `x(${S(`(x+${m})*(x+${n})`)})`, note: 'Mise en évidence de x.'}, {text: `Somme ${m + n}, produit ${m * n} : les nombres ${m} et ${n}.`}, {src: `x(x + ${m})(x + ${n})`}]},
      {kind: 'expr', text: 'Calcule le volume pour {{x = 5}}.', answer: String(5 * (5 + m) * (5 + n)), from: `5*(5+${m})*(5+${n})`, check: 'number', unit: 'cm³', hint: 'Avec la forme factorisée, c’est un simple produit de trois nombres.', steps: [{src: `5*(5 + ${m})*(5 + ${n})`}, {src: String(5 * (5 + m) * (5 + n))}]}
    ]
  };
}

export const chapter4 = {
  id: 4,
  title: 'Factorisation',
  subtitle: 'Mise en évidence, identités, trinôme unitaire',
  rappel: [
    {tex: 'k\\,a + k\\,b = k\\,(a + b)', text: 'Mise en évidence du facteur commun'},
    {tex: 'a^{2} - b^{2} = (a - b)(a + b)', text: 'Différence de deux carrés'},
    {tex: 'x^{2} + s\\,x + p = (x + m)(x + n)', text: 'Trinôme unitaire : m + n = s et m · n = p'},
    {tex: '2x^{2} - 18 = 2(x^{2} - 9) = 2(x - 3)(x + 3)', text: 'Factoriser complètement : d’abord la mise en évidence'}
  ],
  levels: {
    1: r => [
      {title: 'Factorise en mettant en évidence.', items: [commonFactor(r), commonFactor(r), commonFactor(r), lettersFactor(r), commonFactor(r, 2), commonFactor(r, 2)]},
      {title: 'Complète.', items: [fillFactor(r), fillFactor(r), fillFactor(r)]}
    ],
    2: r => [
      {title: 'Factorise (le facteur commun est une parenthèse).', items: [bracketFactor(r), bracketFactor(r), bracketFactor(r)]},
      {title: 'Factorise ces trinômes unitaires.', items: [unitTrinomial(r), unitTrinomial(r), unitTrinomial(r), unitTrinomial(r)]},
      rectangleLengthProblem(r)
    ],
    3: r => [
      {title: 'Factorise complètement.', items: r.shuffle([completeFactor(r, 'diffSq'), completeFactor(r, 'square'), completeFactor(r, 'cubic'), completeFactor(r, 'trinomial'), completeFactor(r, 'xSquare'), completeFactor(r, 'group')])},
      {title: 'Factorise.', items: [diffSquaresBinomial(r), diffOfBinomialSquares(r)]},
      boxVolumeProblem(r)
    ]
  }
};

export {productSteps, identityCombo, diffOfBinomialSquares, unitTrinomial, completeFactor, bracketFactor, mentalCalc, identityExpand};
