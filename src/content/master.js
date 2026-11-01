// Mode Master : un test complet, plus difficile que le niveau 3, corrigé seulement à la fin.
import {S, lin, gcdInt, joinTerms, termsOf, opposite, dedupe, productSteps} from './helpers.js';
import {diffOfBinomialSquares, completeFactor} from './ch3-4.js';
import {gardenPath} from './ch5-6.js';

function expandCombo(r) {
  const a = r.int(2, 3), b = r.nz(-5, 5), c = r.nz(-6, 6), d = r.nz(-6, 6);
  const first = `(${lin(a, b)})^2`, second = `(${lin(1, c)})(${lin(1, d)})`;
  const prompt = `${first} - ${second}`;
  const e1 = S(first), e2 = S(second);
  return {kind: 'expr', prompt, answer: S(prompt), check: 'expanded', hint: 'Identité pour le carré, double distributivité pour le produit, puis attention au signe −.',
    steps: dedupe([{src: `(${e1}) - (${e2})`}, {src: joinTerms([...termsOf(e1), ...termsOf(opposite(e2))])}, {src: S(prompt)}])};
}
function cube(r) {
  const a = r.nz(-4, 4);
  const B = lin(1, a), sq = S(`(${B})^2`);
  const prompt = `(${B})^3`;
  return {kind: 'expr', prompt, answer: S(prompt), check: 'expanded', hint: `(x ${a < 0 ? '−' : '+'} ${Math.abs(a)})³ = (x ${a < 0 ? '−' : '+'} ${Math.abs(a)})² · (x ${a < 0 ? '−' : '+'} ${Math.abs(a)}).`,
    steps: dedupe([{src: `(${B})^2*(${B})`, note: 'Un cube, c’est un carré multiplié encore une fois.'}, {src: `(${sq})(${B})`, note: 'Identité remarquable pour le carré.'}, ...productSteps(sq, B)])};
}
function twoVarReduce(r) {
  const p = r.int(2, 6), q = r.int(2, 5), s = r.int(1, 4), t = r.int(2, 7);
  const prompt = `${p}a^2b - ${q}ab^2 - (${s}a^2b - ${t}ab^2) + ab(a - b)`;
  return {kind: 'expr', prompt, answer: S(prompt), check: 'expanded', hint: 'Développe ab(a − b), enlève la parenthèse précédée d’un −, puis regroupe les a²b et les ab².',
    steps: dedupe([{src: `${p}a^2b - ${q}ab^2 - ${s}a^2b + ${t}ab^2 + a^2b - ab^2`, note: 'On enlève les parenthèses et on développe ab(a − b).'}, {src: S(prompt), note: 'On réduit les a²b, puis les ab².'}])};
}
function quartic(r) {
  const c = r.int(1, 3);
  return {kind: 'expr', prompt: `x^4 - ${c ** 4}`, answer: `(x - ${c})(x + ${c})(x^2 + ${c * c})`, check: 'factored', hint: `x⁴ = (x²)² et ${c ** 4} = (${c * c})² : c’est une différence de deux carrés… deux fois !`,
    steps: [{src: `(x^2)^2 - ${c * c}^2`}, {src: `(x^2 - ${c * c})(x^2 + ${c * c})`, note: 'a² − b² = (a − b)(a + b)'}, {src: `(x - ${c})(x + ${c})(x^2 + ${c * c})`, note: `x² − ${c * c} se factorise encore ; x² + ${c * c} non.`}]};
}
function kxDiffSquares(r) {
  const k = r.int(2, 5), c = r.int(2, 6);
  const prompt = S(`${k}*x^3 - ${k * c * c}*x`);
  return {kind: 'expr', prompt, answer: `${k}x(x - ${c})(x + ${c})`, check: 'factored', hint: 'Mets en évidence tout ce qui est commun (un nombre ET une lettre), puis regarde ce qui reste.',
    steps: [{src: `${k}x(x^2 - ${c * c})`, note: `Mise en évidence de ${k}x.`}, {src: `${k}x(x - ${c})(x + ${c})`, note: 'a² − b² = (a − b)(a + b)'}]};
}
function bigTrinomial(r) {
  let m, n;
  do { m = r.nz(-12, 12); n = r.nz(-12, 12); } while (m + n === 0 || m === n || Math.abs(m * n) < 20);
  const prompt = S(`(x+(${m}))*(x+(${n}))`);
  return {kind: 'expr', prompt, answer: `(${lin(1, m)})(${lin(1, n)})`, check: 'factored', hint: `Somme ${m + n}, produit ${m * n}. Liste les diviseurs de ${Math.abs(m * n)}.`,
    steps: [{text: `On cherche deux nombres de somme ${m + n} et de produit ${m * n} : ${m} et ${n}.`}, {src: `(${lin(1, m)})(${lin(1, n)})`}]};
}
function hiddenCommon(r) {
  for (;;) {
    const a = r.nz(-5, 5), b = r.int(1, 3), c = r.nz(-5, 5);
    const B = lin(1, a), second = lin(b + 1, a + c);
    if (a + c === 0 || gcdInt(b + 1, a + c) !== 1) continue;
    const prompt = `(${B})(${lin(b, c)}) + (${B})^2`;
    return {kind: 'expr', prompt, answer: `(${B})(${second})`, check: 'factored', hint: `(${B})² = (${B})(${B}) : la parenthèse (${B}) est commune aux deux termes.`,
      steps: [{src: `(${B})(${lin(b, c)}) + (${B})(${B})`, note: `On écrit le carré comme un produit.`}, {src: `(${B})((${lin(b, c)}) + (${B}))`, note: `Mise en évidence de (${B}).`}, {src: `(${B})(${second})`, note: 'On réduit la deuxième parenthèse.'}]};
  }
}
function fourConsecutive() {
  return {
    kind: 'proof',
    text: 'Démontre que le produit de quatre entiers consécutifs, augmenté de 1, est toujours un carré parfait : n(n + 1)(n + 2)(n + 3) + 1 = (n² + 3n + 1)².',
    hint: 'Développe les deux membres séparément. Astuce : n(n + 3) et (n + 1)(n + 2) commencent tous les deux par n² + 3n.',
    steps: [
      {label: 'Le membre de gauche, développé et réduit :', answer: 'n^4 + 6n^3 + 11n^2 + 6n + 1', check: 'expanded', from: 'n(n+1)(n+2)(n+3)+1'},
      {label: 'Le membre de droite, développé et réduit :', answer: 'n^4 + 6n^3 + 11n^2 + 6n + 1', check: 'expanded', from: '(n^2+3n+1)^2'}
    ],
    conclusion: {question: 'Que peux-tu conclure ?', options: ['Les deux membres sont égaux pour tout n : le nombre est le carré de l’entier n² + 3n + 1.', 'C’est vrai seulement pour les petits nombres.', 'Il faut encore vérifier avec n = 1, 2 et 3.'], answer: 0},
    redaction: [{text: '{{n(n + 3) = n^2 + 3n}} et {{(n + 1)(n + 2) = n^2 + 3n + 2}}.'}, {text: 'En posant {{u = n^2 + 3n}} : {{u(u + 2) + 1 = u^2 + 2u + 1 = (u + 1)^2 = (n^2 + 3n + 1)^2}}.'}]
  };
}
function bigMental(r) {
  const d = r.int(2, 4), kind = r.pick(['sq', 'conj']);
  if (kind === 'sq') return {kind: 'expr', text: `Calcule {{${1000 - d}^2}} sans calculatrice.`, answer: String((1000 - d) ** 2), from: `${1000 - d}^2`, check: 'number', hint: `${1000 - d} = 1000 − ${d}.`,
    steps: [{src: `(1000 - ${d})^2`}, {src: `1000000 - ${2000 * d} + ${d * d}`, note: '(a − b)² = a² − 2ab + b²'}, {src: String((1000 - d) ** 2)}]};
  return {kind: 'expr', text: `Calcule {{${1000 + d}*${1000 - d}}} sans calculatrice.`, answer: String(1000000 - d * d), from: `${1000 + d}*${1000 - d}`, check: 'number', hint: 'Somme × différence…',
    steps: [{src: `(1000 + ${d})(1000 - ${d})`}, {src: `1000^2 - ${d}^2`, note: '(a + b)(a − b) = a² − b²'}, {src: String(1000000 - d * d)}]};
}
const TRUE_FALSE = [
  {text: 'Pour tout nombre x : {{(x - 3)^2 = (3 - x)^2}}.', answer: 0, explain: 'Vrai : 3 − x = −(x − 3), et un nombre et son opposé ont le même carré.'},
  {text: 'Pour tout nombre a : {{(2a)^2 = 2a^2}}.', answer: 1, explain: 'Faux : (2a)² = 4a². Contre-exemple : a = 1 donne 4 d’un côté et 2 de l’autre.'},
  {text: 'Pour tout nombre x, {{x^2 - 6x + 9}} est positif ou nul.', answer: 0, explain: 'Vrai : x² − 6x + 9 = (x − 3)², et un carré n’est jamais négatif.'},
  {text: 'Pour tout nombre x : {{-(x - 5) = -x - 5}}.', answer: 1, explain: 'Faux : −(x − 5) = −x + 5. Le − change aussi le signe du 5.'},
  {text: 'La somme de deux nombres pairs est toujours paire.', answer: 0, explain: 'Vrai : 2n + 2m = 2(n + m), c’est un multiple de 2.'}
];
function trueFalse(r) {
  return r.shuffle(TRUE_FALSE).slice(0, 3).map(q => ({kind: 'choice', text: q.text, options: ['Vrai', 'Faux'], answer: q.answer, explain: q.explain}));
}

export function masterTest(r) {
  return [
    {title: 'Développe et réduis.', items: [expandCombo(r)]},
    {title: 'Développe et réduis.', items: [cube(r)]},
    {title: 'Réduis.', items: [twoVarReduce(r)]},
    {title: 'Factorise complètement.', items: [kxDiffSquares(r)]},
    {title: 'Factorise complètement.', items: [quartic(r)]},
    {title: 'Factorise complètement.', items: [diffOfBinomialSquares(r)]},
    {title: 'Factorise.', items: [bigTrinomial(r)]},
    {title: 'Factorise.', items: [hiddenCommon(r)]},
    {title: 'Factorise complètement.', items: [completeFactor(r, r.pick(['trinomial', 'xSquare', 'square']))]},
    {title: 'Démontre.', items: [fourConsecutive()]},
    {...gardenPath(r), title: 'Problème'},
    {title: 'Calcul astucieux', items: [bigMental(r)]},
    {title: 'Vrai ou faux ?', items: trueFalse(r)}
  ];
}
