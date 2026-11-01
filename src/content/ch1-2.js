// Chapitre 1 : Développements. Chapitre 2 : Réductions.
import {S, lin, quad, pn, wrap, termsOf, productSteps, distributeSteps, opposite, joinTerms, dedupe} from './helpers.js';

// ---------- petits générateurs réutilisables ----------
function monomialProduct(r) {
  const v = r.pick(['x', 'a', 'y']);
  const c1 = r.nz(-6, 7), c2 = r.nz(-5, 6), e1 = r.int(1, 2), e2 = r.int(1, 3);
  const m1 = S(`${c1}*${v}^${e1}`), m2 = S(`${c2}*${v}^${e2}`);
  const prompt = `${m1}*${m2.startsWith('-') ? `(${m2})` : m2}`;
  return {
    kind: 'expr', prompt, answer: S(prompt), check: 'expanded',
    hint: 'On multiplie les nombres entre eux, puis les lettres entre elles (on additionne les exposants).',
    steps: [{src: `${pn(c1)}*${pn(c2)}*${v}^${e1}*${v}^${e2}`, note: 'On regroupe les nombres et les lettres.'}, {src: S(prompt), note: `${v}^${e1} · ${v}^${e2} = ${v}^${e1 + e2}`}]
  };
}

export function simpleDistribution(r, kind = 'number') {
  const v = 'x';
  let k, inner;
  if (kind === 'number') { k = String(r.nz(-9, 9)); inner = lin(r.int(1, 7), r.nz(-9, 9), v); }
  else if (kind === 'x') { k = r.pick(['x', '-x']); inner = lin(1, r.nz(-9, 9), v); }
  else { k = S(`${r.nz(-5, 6)}x`); inner = lin(r.nz(-6, 6), r.nz(-9, 9), v); }
  const prompt = `${k}${wrap(inner)}`;
  return {
    kind: 'expr', prompt, answer: S(prompt), check: 'expanded',
    hint: 'Multiplie le facteur devant la parenthèse par chaque terme de la parenthèse. Attention aux signes.',
    steps: productSteps(k, inner, 'On distribue le facteur à chaque terme de la parenthèse.')
  };
}

export function doubleDistribution(r, mode = 'unit') {
  const a1 = mode === 'unit' ? 1 : r.nz(-4, 5), a2 = mode === 'unit' ? 1 : r.int(1, 5);
  const A = lin(a1, r.nz(-9, 9)), B = lin(a2, r.nz(-9, 9));
  const prompt = `${wrap(A)}${wrap(B)}`;
  return {
    kind: 'expr', prompt, answer: S(prompt), check: 'expanded',
    hint: 'Chaque terme de la première parenthèse multiplie chaque terme de la seconde : cela fait 4 produits.',
    steps: productSteps(A, B)
  };
}

// Somme ou différence de produits : on développe chaque produit, on enlève les parenthèses, on réduit.
// parts : [{sign: 1|-1, a: 'facteur', b: 'facteur'}] ; a peut être un entier, un monôme ou un binôme.
function combo(r, parts) {
  parts = parts.map(p => (/^-\d+$/.test(p.a) ? {...p, sign: -p.sign, a: p.a.slice(1)} : p));
  const show = p => (/^\d+$/.test(p.a) || /^-?\d*[a-z]$/.test(p.a) ? `${p.a}${wrap(p.b)}` : `${wrap(p.a)}${wrap(p.b)}`);
  const lead = (p, i) => (i === 0 ? (p.sign < 0 ? '-' : '') : p.sign < 0 ? ' - ' : ' + ');
  const prompt = parts.map((p, i) => lead(p, i) + show(p)).join('');
  const expanded = parts.map(p => S(`(${p.a})*(${p.b})`));
  const bracketed = parts.map((p, i) => lead(p, i) + wrap(expanded[i])).join('');
  const removed = joinTerms(parts.flatMap((p, i) => termsOf(p.sign < 0 ? opposite(expanded[i]) : expanded[i])));
  return {
    kind: 'expr', prompt, answer: S(prompt), check: 'expanded',
    hint: 'Développe chaque produit séparément en gardant des parenthèses, puis enlève-les (attention au signe − devant une parenthèse) et réduis.',
    steps: dedupe([
      {src: bracketed, note: 'On développe chaque produit, en gardant les parenthèses.'},
      {src: removed, note: 'On enlève les parenthèses : un signe − devant change tous les signes.'},
      {src: S(prompt), note: 'On réduit.'}
    ])
  };
}

// ======================= CHAPITRE 1 =======================
export const chapter1 = {
  id: 1,
  title: 'Développements',
  subtitle: 'Distributivité, multiplication de polynômes',
  rappel: [
    {tex: 'k\\,(a + b) = k\\,a + k\\,b', text: 'Distributivité simple'},
    {tex: '(a + b)(c + d) = ac + ad + bc + bd', text: 'Double distributivité : chaque terme multiplie chaque terme'},
    {tex: '-(a - b + c) = -a + b - c', text: 'Un signe − devant une parenthèse change tous les signes'},
    {tex: 'x^{2} \\cdot x^{3} = x^{5}', text: 'On additionne les exposants'}
  ],
  levels: {
    1: r => [
      {title: 'Effectue.', items: [monomialProduct(r), monomialProduct(r), monomialProduct(r), monomialProduct(r)]},
      {title: 'Développe et réduis.', items: [simpleDistribution(r), simpleDistribution(r), simpleDistribution(r), simpleDistribution(r, 'x'), simpleDistribution(r, 'mono'), simpleDistribution(r, 'mono')]},
      cinemaProblem(r)
    ],
    2: r => [
      {title: 'Développe et réduis.', items: [doubleDistribution(r), doubleDistribution(r), doubleDistribution(r, 'any'), doubleDistribution(r, 'any'), doubleDistribution(r, 'any')]},
      {title: 'Développe et réduis.', items: [
        monoTimesTrinomial(r),
        combo(r, [{sign: 1, a: String(r.int(2, 6)), b: lin(1, r.nz(-8, 8))}, {sign: -1, a: String(r.int(2, 6)), b: lin(1, r.nz(-8, 8))}]),
        combo(r, [{sign: 1, a: 'x', b: lin(1, r.nz(-8, 8))}, {sign: 1, a: String(r.nz(-6, 6)), b: lin(1, r.nz(-8, 8))}]),
        combo(r, [{sign: 1, a: lin(1, r.nz(-6, 6)), b: lin(1, r.nz(-6, 6))}, {sign: 1, a: String(r.int(2, 5)), b: lin(r.int(1, 3), r.nz(-6, 6))}])
      ]},
      gardenProblem(r)
    ],
    3: r => [
      {title: 'Développe et réduis.', items: [binomialTrinomial(r), binomialTrinomial(r), threeFactors(r), twoVariables(r)]},
      {title: 'Développe et réduis.', items: [
        combo(r, [{sign: 1, a: lin(1, r.nz(-7, 7)), b: lin(1, r.nz(-7, 7))}, {sign: -1, a: lin(1, r.nz(-7, 7)), b: lin(1, r.nz(-7, 7))}]),
        combo(r, [{sign: 1, a: `${r.int(2, 5)}x`, b: lin(1, r.nz(-6, 6))}, {sign: -1, a: lin(r.int(2, 3), r.nz(-5, 5)), b: lin(1, r.nz(-6, 6))}]),
        combo(r, [{sign: 1, a: lin(r.int(2, 3), r.nz(-5, 5)), b: lin(1, r.nz(-6, 6))}, {sign: -1, a: lin(r.int(2, 3), r.nz(-5, 5)), b: lin(r.int(1, 2), r.nz(-6, 6))}])
      ]},
      terrainProblem(r)
    ]
  }
};

function monoTimesTrinomial(r) {
  const k = S(`${r.nz(-4, 5)}x`);
  const T = quad(r.nz(-3, 4), r.nz(-6, 6), r.nz(-9, 9));
  const prompt = `${k}${wrap(T)}`;
  return {kind: 'expr', prompt, answer: S(prompt), check: 'expanded', hint: 'Le monôme devant multiplie chacun des trois termes.', steps: productSteps(k, T, 'On distribue le monôme à chacun des trois termes.')};
}
function binomialTrinomial(r) {
  const A = lin(r.int(1, 3), r.nz(-5, 5)), T = quad(1, r.nz(-5, 5), r.nz(-6, 6));
  const prompt = `${wrap(A)}${wrap(T)}`;
  return {kind: 'expr', prompt, answer: S(prompt), check: 'expanded', hint: '2 termes × 3 termes = 6 produits. Range-les par puissances de x avant de réduire.', steps: productSteps(A, T)};
}
function threeFactors(r) {
  const k = r.int(2, 5), A = lin(1, r.nz(-6, 6)), B = lin(1, r.nz(-6, 6));
  const prompt = `${k}${wrap(A)}${wrap(B)}`;
  const AB = S(`(${A})*(${B})`);
  return {
    kind: 'expr', prompt, answer: S(prompt), check: 'expanded',
    hint: `Développe d’abord les deux parenthèses, puis multiplie le résultat par ${k}.`,
    steps: dedupe([{src: `${k}*(${distributeSteps(A, B).results})`, note: 'On développe d’abord les deux parenthèses.'}, {src: `${k}*(${AB})`}, {src: S(prompt), note: `On distribue ${k}.`}])
  };
}
function twoVariables(r) {
  const A = S(`${r.int(1, 3)}a + (${r.nz(-4, 4)})b`), B = S(`${r.int(1, 3)}a + (${r.nz(-4, 4)})b`);
  const prompt = `${wrap(A)}${wrap(B)}`;
  return {kind: 'expr', prompt, answer: S(prompt), check: 'expanded', hint: 'Même méthode avec deux lettres : ab et ba sont des termes semblables.', steps: productSteps(A, B)};
}

function cinemaProblem(r) {
  const extra = r.int(4, 12), price = r.pick([10, 12, 14, 15, 16]);
  const places = `x(x+${extra})`;
  return {
    title: 'Problème',
    intro: `Une salle de cinéma compte {{x}} rangées. Chaque rangée a {{x + ${extra}}} places. Un billet coûte ${price} francs.`,
    items: [
      {kind: 'expr', text: 'Exprime le nombre de places de la salle, sous forme développée réduite.', answer: S(places), from: places, check: 'expanded',
        hint: 'Nombre de places = nombre de rangées × places par rangée.', steps: productSteps('x', `x+${extra}`, 'Nombre de rangées × nombre de places par rangée.')},
      {kind: 'expr', text: 'Exprime la recette (en francs) quand la salle est pleine, sous forme développée réduite.', answer: S(`${price}*${places}`), from: `${price}*${places}`, check: 'expanded',
        hint: 'Recette = prix d’un billet × nombre de places.', steps: [{src: `${price}*(${S(places)})`, note: 'Prix × nombre de places.'}, {src: S(`${price}*${places}`)}]},
      {kind: 'expr', text: 'Calcule la recette si la salle a 15 rangées (donc {{x = 15}}).', answer: String(price * 15 * (15 + extra)), from: `${price}*15*(15+${extra})`, check: 'number', unit: 'fr.',
        hint: 'Remplace x par 15 dans ton expression.', steps: [{src: `${price}*15*(15+${extra})`, note: 'On remplace x par 15.'}, {src: String(price * 15 * (15 + extra))}]}
    ]
  };
}

function gardenProblem(r) {
  const a = r.int(2, 3), b = r.int(1, 5), c = r.int(2, 6), xv = r.int(4, 9);
  const L = lin(a, b), l = lin(1, c);
  const area = `(${L})(${l})`;
  return {
    title: 'Problème',
    intro: `Un jardin rectangulaire mesure {{${L}}} m de long et {{${l}}} m de large.`,
    figure: {type: 'rect', w: 1.6, h: 1, top: L, right: l, unit: 'm'},
    items: [
      {kind: 'expr', text: 'Exprime l’aire du jardin sous forme développée réduite.', answer: S(area), from: area, check: 'expanded', unit: 'm²', hint: 'Aire d’un rectangle = longueur × largeur, puis double distributivité.', steps: productSteps(L, l, 'Longueur × largeur.')},
      {kind: 'expr', text: 'Exprime le périmètre du jardin sous forme réduite.', answer: S(`2*(${L})+2*(${l})`), from: `2*(${L})+2*(${l})`, check: 'expanded', unit: 'm', hint: 'Périmètre = 2 × longueur + 2 × largeur.', steps: [{src: `2*(${L}) + 2*(${l})`}, {src: S(`2*(${L}) + 2*(${l})`)}]},
      {kind: 'expr', text: `Calcule l’aire si {{x = ${xv}}}.`, answer: String((a * xv + b) * (xv + c)), from: `(${a}*${xv}+${b})*(${xv}+${c})`, check: 'number', unit: 'm²', hint: `Remplace x par ${xv}, dans la forme que tu préfères.`, steps: [{src: `(${a}*${xv} + ${b})*(${xv} + ${c})`, note: `On remplace x par ${xv}.`}, {src: `${a * xv + b}*${xv + c}`}, {src: String((a * xv + b) * (xv + c))}]}
    ]
  };
}

function terrainProblem(r) {
  const p = r.int(2, 6), m = r.int(1, 4), xv = r.int(10, 20);
  const area = `(x+${p})(x-${m})`;
  const diff = `(x+${p})(x-${m}) - x^2`;
  return {
    title: 'Problème',
    intro: `Un terrain carré a un côté de {{x}} m. On allonge un côté de ${p} m et on raccourcit l’autre de ${m} m : le terrain devient rectangulaire.`,
    figure: {type: 'rect', w: 1.4, h: 1, top: `x+${p}`, right: `x-${m}`, unit: 'm'},
    items: [
      {kind: 'expr', text: 'Exprime l’aire du nouveau terrain sous forme développée réduite.', answer: S(area), from: area, check: 'expanded', unit: 'm²', hint: 'Les nouvelles dimensions sont x + … et x − ….', steps: productSteps(`x+${p}`, `x-${m}`)},
      {kind: 'expr', text: 'Exprime la variation d’aire (nouvelle aire − ancienne aire), réduite.', answer: S(diff), from: diff, check: 'expanded', unit: 'm²', hint: 'Ancienne aire : x². Soustrais-la de la nouvelle aire.', steps: [{src: `(${S(area)}) - x^2`}, {src: S(diff)}]},
      {kind: 'expr', text: `Calcule cette variation pour {{x = ${xv}}}. (Un résultat négatif veut dire que l’aire diminue.)`, answer: String((xv + p) * (xv - m) - xv * xv), from: `(${xv}+${p})*(${xv}-${m})-${xv}^2`, check: 'number', unit: 'm²', hint: `Remplace x par ${xv} dans ta réponse précédente.`, steps: [{src: `${p - m}*${xv} - ${p * m}`, note: `On remplace x par ${xv} dans ${S(diff)}.`}, {src: String((xv + p) * (xv - m) - xv * xv)}]}
    ]
  };
}

// ======================= CHAPITRE 2 =======================
function likeTerms(r, v = 'x', count = 3) {
  let cs;
  do cs = Array.from({length: count}, () => r.nz(-9, 9)); while (cs.reduce((a, b) => a + b, 0) === 0);
  const prompt = joinTerms(cs.map(c => S(`${c}*${v}`)));
  return {kind: 'expr', prompt, answer: S(prompt), check: 'expanded', hint: 'Tous ces termes sont semblables : additionne leurs coefficients.', steps: [{src: `(${cs.map((c, i) => (i ? (c < 0 ? ` - ${-c}` : ` + ${c}`) : c)).join('')})${v}`, note: 'On additionne les coefficients.'}, {src: S(prompt)}]};
}
function mixedTerms(r, families) {
  // families : [['x^2', 2], ['x', 2], ['', 1]] -> nombre de termes de chaque famille, mélangés
  const terms = [];
  for (const [key, n] of families) for (let i = 0; i < n; i++) terms.push(S(`${r.nz(-9, 9)}${key ? '*' + key : ''}`));
  const shuffled = r.shuffle(terms);
  const prompt = joinTerms(shuffled);
  const grouped = families.map(([key]) => shuffled.filter(t => sameFamily(t, key)));
  const regroup = joinTerms(grouped.flat());
  return {kind: 'expr', prompt, answer: S(prompt), check: 'expanded', hint: 'Regroupe les termes semblables (même partie littérale), puis additionne leurs coefficients.', steps: dedupe([{src: regroup, note: 'On regroupe les termes semblables.'}, {src: S(prompt), note: 'On réduit chaque groupe.'}])};
}
function sameFamily(term, key) {
  const k = [...(S(term) ? termsOf(term) : [])][0];
  const letters = k.replace(/^-?[\d/]*/, '');
  return letters === key.replace(/\*/g, '');
}
function bracketSum(r, sign, A, B) {
  const prompt = `${wrap(A)} ${sign < 0 ? '-' : '+'} ${wrap(B)}`;
  const removed = joinTerms([...termsOf(A), ...termsOf(sign < 0 ? opposite(B) : B)]);
  return {kind: 'expr', prompt, answer: S(prompt), check: 'expanded', hint: sign < 0 ? 'Le signe − devant la seconde parenthèse change le signe de chacun de ses termes.' : 'Un signe + devant une parenthèse : on l’enlève sans rien changer.', steps: dedupe([{src: removed, note: sign < 0 ? 'On enlève les parenthèses en changeant les signes de la seconde.' : 'On enlève les parenthèses.'}, {src: S(prompt), note: 'On réduit.'}])};
}

export const chapter2 = {
  id: 2,
  title: 'Réductions',
  subtitle: 'Addition et soustraction de monômes et de polynômes',
  rappel: [
    {tex: '5x + 3x - x = 7x', text: 'On additionne les coefficients des termes semblables'},
    {tex: '3x^{2} + 2x \\text{ ne se réduit pas}', text: 'x² et x ne sont pas semblables'},
    {tex: '(a - b) - (c - d) = a - b - c + d', text: 'Un − devant une parenthèse change tous les signes'}
  ],
  levels: {
    1: r => [
      {title: 'Réduis.', items: [likeTerms(r, 'x'), likeTerms(r, 'a', 4), mixedTerms(r, [['x', 2], ['', 2]]), mixedTerms(r, [['y', 2], ['', 2]])]},
      {title: 'Réduis.', items: [mixedTerms(r, [['x^2', 2], ['x', 2]]), mixedTerms(r, [['a', 2], ['b', 2]]), mixedTerms(r, [['x^2', 2], ['x', 2], ['', 1]]), mixedTerms(r, [['x*y', 2], ['x', 2]])]},
      shoppingProblem(r)
    ],
    2: r => {
      const items = [
        bracketSum(r, 1, quad(r.nz(-5, 5), r.nz(-6, 6), r.nz(-9, 9)), quad(r.nz(-5, 5), r.nz(-6, 6), r.nz(-9, 9))),
        bracketSum(r, -1, S(`${r.nz(-5, 5)}a+(${r.nz(-6, 6)})b`), S(`${r.nz(-5, 5)}a+(${r.nz(-6, 6)})b`)),
        bracketSum(r, -1, quad(r.nz(-4, 4), r.nz(-6, 6), r.nz(-9, 9)), quad(r.nz(-4, 4), r.nz(-6, 6), r.nz(-9, 9))),
        chainBrackets(r)
      ];
      return [
        {title: 'Réduis.', items},
        polyABC(r),
        thirdSideProblem(r)
      ];
    },
    3: r => [
      {title: 'Réduis.', items: [mixedTerms(r, [['x^2*y', 2], ['x*y^2', 2]]), nestedBrackets(r), decimalTerms(r), mixedTerms(r, [['a*b', 2], ['a^2', 2], ['b^2', 1]])]},
      polyABC(r, true),
      agesProblem(r)
    ]
  }
};

function chainBrackets(r) {
  const a = r.int(2, 7), A = lin(r.int(1, 4), r.nz(-6, 6)), B = lin(1, r.nz(-6, 6));
  const prompt = `${a}x - ${wrap(A)} + ${wrap(B)}`;
  const removed = joinTerms([`${a}x`, ...termsOf(opposite(A)), ...termsOf(B)]);
  return {kind: 'expr', prompt, answer: S(prompt), check: 'expanded', hint: 'Enlève les parenthèses une par une en regardant le signe qui les précède.', steps: [{src: removed, note: 'On enlève les parenthèses.'}, {src: S(prompt), note: 'On réduit.'}]};
}
function nestedBrackets(r) {
  const a = r.int(2, 6), b = r.int(2, 9), c = r.int(1, 9);
  const prompt = `${a}x - [${b} - (x - ${c})]`;
  const inner = S(`${b} - (x - ${c})`);
  return {kind: 'expr', prompt, answer: S(prompt), check: 'expanded', hint: 'Commence par la parenthèse la plus intérieure, puis les crochets.', steps: [{src: `${a}x - [${b} - x + ${c}]`, note: 'On enlève d’abord la parenthèse intérieure.'}, {src: `${a}x - (${inner})`, note: 'On réduit dans les crochets.'}, {src: S(prompt), note: 'On enlève les crochets (signe −) et on réduit.'}]};
}
function decimalTerms(r) {
  const vals = [r.int(1, 9) / 10 + r.int(0, 2), -(r.int(1, 9) / 10), r.int(1, 9) / 10 + 1, -(r.int(1, 9) / 10)];
  const fmt = n => String(Math.round(n * 10) / 10).replace('.', ',');
  const terms = [`${fmt(vals[0])}x^2`, `${fmt(vals[1])}x`, `${fmt(vals[2])}x`, `${fmt(vals[3])}x^2`];
  const prompt = joinTerms(terms);
  return {kind: 'expr', prompt, answer: S(prompt), check: 'expanded', hint: 'Les coefficients décimaux s’additionnent comme les autres. Tu peux écrire 0,5 ou 0.5.', steps: [{src: joinTerms([terms[0], terms[3], terms[1], terms[2]]), note: 'On regroupe les termes semblables.'}, {src: S(prompt)}]};
}

function polyABC(r, hard = false) {
  const A = quad(r.nz(-4, 5), r.nz(-6, 6), r.nz(-9, 9)), B = quad(r.nz(-4, 5), r.nz(-6, 6), r.nz(-9, 9));
  const C = hard ? quad(r.nz(-3, 3), r.nz(-6, 6), r.nz(-9, 9)) : lin(r.nz(-5, 5), r.nz(-9, 9));
  const item = (tex, src, removedTerms, hint) => ({
    kind: 'expr', promptTex: tex, from: src, answer: S(src), check: 'expanded', hint,
    steps: dedupe([{src, note: 'On remplace A, B et C par leurs expressions, entre parenthèses.'}, {src: joinTerms(removedTerms), note: 'On enlève les parenthèses.'}, {src: S(src), note: 'On réduit.'}])
  });
  const items = [
    item('A + B', `(${A}) + (${B})`, [...termsOf(A), ...termsOf(B)], 'Recopie A et B entre parenthèses, puis réduis.'),
    item('A - B', `(${A}) - (${B})`, [...termsOf(A), ...termsOf(opposite(B))], 'Le signe − change tous les signes de B.'),
    hard
      ? item('A - (B - C)', `(${A}) - ((${B}) - (${C}))`, [...termsOf(A), ...termsOf(opposite(S(`(${B})-(${C})`)))], 'Calcule d’abord B − C, puis soustrais le résultat de A.')
      : item('A - B + C', `(${A}) - (${B}) + (${C})`, [...termsOf(A), ...termsOf(opposite(B)), ...termsOf(C)], 'Attention au signe devant chaque parenthèse.')
  ];
  return {title: 'Calcule et réduis.', intro: `On donne {{A = ${A}}}, {{B = ${B}}} et {{C = ${C}}}.`, items};
}

function shoppingProblem(r) {
  const p1 = r.int(2, 5), q1 = r.int(1, 4), p2 = r.int(1, 3), q2 = r.int(2, 5);
  const total = `${p1}a + ${q1}b + ${p2}a + ${q2}b`;
  return {
    title: 'Problème',
    intro: `Au marché, Daniel achète ${p1} kg de pommes et ${q1} kg de poires. Sa sœur achète ${p2} kg de pommes et ${q2} kg de poires. Un kilo de pommes coûte {{a}} francs et un kilo de poires {{b}} francs.`,
    items: [
      {kind: 'expr', text: 'Exprime le montant total payé par les deux, sous forme réduite.', answer: S(total), from: total, check: 'expanded', unit: 'fr.', hint: 'Écris ce que paie chacun, puis additionne les termes semblables.', steps: [{src: `(${p1}a + ${q1}b) + (${p2}a + ${q2}b)`, note: 'Montant de Daniel + montant de sa sœur.'}, {src: S(total)}]},
      {kind: 'expr', text: 'Combien Daniel paie-t-il de plus que sa sœur ? Exprime la différence, réduite.', answer: S(`(${p1}a + ${q1}b) - (${p2}a + ${q2}b)`), from: `(${p1}a + ${q1}b) - (${p2}a + ${q2}b)`, check: 'expanded', unit: 'fr.', hint: 'Montant de Daniel − montant de sa sœur. Le signe − change les signes de la seconde parenthèse.', steps: [{src: `(${p1}a + ${q1}b) - (${p2}a + ${q2}b)`}, {src: `${p1}a + ${q1}b - ${p2}a - ${q2}b`}, {src: S(`(${p1}a + ${q1}b) - (${p2}a + ${q2}b)`)}]}
    ]
  };
}

function thirdSideProblem(r) {
  const s1 = lin(r.int(1, 3), r.int(1, 5)), s2 = lin(r.int(1, 3), r.nz(-3, 4)), s3 = lin(r.int(1, 4), r.int(1, 6));
  const per = S(`(${s1})+(${s2})+(${s3})`);
  return {
    title: 'Problème',
    intro: `Le périmètre d’un triangle vaut {{${per}}} cm. Deux de ses côtés mesurent {{${s1}}} cm et {{${s2}}} cm.`,
    figure: {type: 'triangle', sides: [s1, s2, '?'], unit: 'cm'},
    items: [
      {kind: 'expr', text: 'Exprime la longueur du troisième côté, sous forme réduite.', answer: s3, from: `(${per}) - (${s1}) - (${s2})`, check: 'expanded', unit: 'cm', hint: 'Troisième côté = périmètre − premier côté − deuxième côté.', steps: [{src: `(${per}) - (${s1}) - (${s2})`, note: 'Périmètre moins les deux côtés connus.'}, {src: joinTerms([...termsOf(per), ...termsOf(opposite(s1)), ...termsOf(opposite(s2))])}, {src: s3}]}
    ]
  };
}

function agesProblem(r) {
  const k = r.int(2, 3), plus = r.int(1, 6), minus = r.int(2, 8), years = r.int(3, 10);
  const tom = lin(k, plus), max = S(`${tom} - ${minus}`);
  const sum = `x + (${tom}) + (${max})`;
  const later = `(x+${years}) + (${tom}+${years}) + (${max}+${years})`;
  return {
    title: 'Problème',
    intro: `Léa a {{x}} ans. Tom a ${plus} ans de plus que ${k === 2 ? 'le double' : 'le triple'} de l’âge de Léa. Max a ${minus} ans de moins que Tom.`,
    items: [
      {kind: 'expr', text: 'Exprime l’âge de Tom.', answer: tom, check: 'expanded', hint: `${k === 2 ? 'Le double' : 'Le triple'} de x, c’est ${k}x.`, steps: [{src: tom}]},
      {kind: 'expr', text: 'Exprime l’âge de Max.', answer: max, from: `(${tom}) - ${minus}`, check: 'expanded', hint: `Âge de Tom − ${minus}.`, steps: [{src: `(${tom}) - ${minus}`}, {src: max}]},
      {kind: 'expr', text: 'Exprime la somme des trois âges, réduite.', answer: S(sum), from: sum, check: 'expanded', hint: 'Additionne les trois expressions.', steps: [{src: sum}, {src: S(sum)}]},
      {kind: 'expr', text: `Exprime la somme de leurs âges dans ${years} ans, réduite.`, answer: S(later), from: later, check: 'expanded', hint: `Chacun aura ${years} ans de plus.`, steps: [{src: later}, {src: S(later)}]}
    ]
  };
}
