// Chapitre 5 : Le calcul littéral pour prouver. Chapitre 6 : Aires et périmètres.
import {S, lin, coprime} from './helpers.js';

// ======================= CHAPITRE 5 =======================
const CONCLUDE_MULTIPLE = (k, form) => ({
  question: 'Que peux-tu conclure ?',
  options: [`C’est toujours un multiple de ${k}, car ${form} est ${k} fois un nombre entier.`, `C’est un multiple de ${k} seulement pour certains nombres.`, `On ne peut rien conclure sans essayer des exemples.`],
  answer: 0
});

function consecutiveSum(r) {
  const count = r.pick([3, 5]);
  const terms = Array.from({length: count}, (_, i) => (i === 0 ? 'n' : `n+${i}`));
  const sum = S(terms.map(t => `(${t})`).join('+'));
  const mid = (count - 1) / 2;
  return {
    kind: 'proof',
    text: `Démontre que la somme de ${count} nombres entiers consécutifs est toujours un multiple de ${count}.`,
    hint: `Appelle n le plus petit des nombres. Les suivants s’écrivent n + 1, n + 2, …`,
    steps: [
      ...terms.slice(1).map((t, i) => ({label: `Le ${['deuxième', 'troisième', 'quatrième', 'cinquième'][i]} nombre s’écrit :`, answer: t, check: 'equivalent'})),
      {label: 'Leur somme, réduite :', answer: sum, check: 'expanded', from: terms.map(t => `(${t})`).join('+')},
      {label: `On met ${count} en évidence :`, answer: `${count}(n + ${mid})`, check: `multiple:${count}`, from: sum}
    ],
    conclusion: CONCLUDE_MULTIPLE(count, `${count}(n + ${mid})`),
    redaction: [
      {text: `Soit n un nombre entier. Les ${count} nombres consécutifs sont ${terms.map(t => `{{${t}}}`).join(', ')}.`},
      {text: `Leur somme vaut {{${terms.join(' + ')} = ${sum} = ${count}(n + ${mid})}}.`},
      {text: `Comme {{n + ${mid}}} est un nombre entier, la somme est un multiple de ${count}.`}
    ]
  };
}

function calcProgram(r) {
  const add = r.int(2, 9), mul = r.int(2, 6);
  return {
    kind: 'proof',
    text: `Voici un programme de calcul : « Choisis un nombre. Ajoute ${add}. Multiplie le résultat par ${mul}. Soustrais ${add * mul}. Divise par ${mul}. » Démontre qu’on retrouve toujours le nombre de départ.`,
    hint: 'Appelle x le nombre choisi et écris chaque étape avec x.',
    steps: [
      {label: `On choisit x. On ajoute ${add} :`, answer: `x + ${add}`, check: 'equivalent'},
      {label: `On multiplie par ${mul} (forme développée) :`, answer: S(`${mul}*(x+${add})`), check: 'expanded', from: `${mul}*(x+${add})`},
      {label: `On soustrait ${add * mul} :`, answer: `${mul}x`, check: 'expanded', from: `${mul}*(x+${add}) - ${add * mul}`},
      {label: `On divise par ${mul} :`, answer: 'x', check: 'expanded', from: `(${mul}*(x+${add}) - ${add * mul})/${mul}`}
    ],
    conclusion: {question: 'Que peux-tu conclure ?', options: ['On retrouve toujours le nombre de départ, quel que soit x.', `On obtient toujours ${add}.`, 'Cela marche seulement pour les nombres positifs.'], answer: 0},
    redaction: [
      {text: 'Soit x le nombre choisi.'},
      {text: `{{x → x + ${add} → ${mul}(x + ${add}) = ${S(`${mul}*(x+${add})`)} → ${mul}x → x}}`},
      {text: 'Le résultat est x : on retrouve toujours le nombre de départ.'}
    ]
  };
}

function identityProof(r) {
  const a = r.int(2, 7);
  const lhs = `(x + ${a})^2 - x^2`, rhs = S(lhs);
  return {
    kind: 'proof',
    text: `Démontre que pour tout nombre x : {{${lhs} = ${rhs}}}.`,
    hint: 'Développe le membre de gauche et réduis-le : tu dois retrouver le membre de droite.',
    steps: [
      {label: `On développe (x + ${a})² :`, answer: S(`(x+${a})^2`), check: 'expanded', from: `(x+${a})^2`},
      {label: 'On soustrait x² et on réduit :', answer: rhs, check: 'expanded', from: lhs}
    ],
    conclusion: {question: 'Que peux-tu conclure ?', options: ['L’égalité est vraie pour tous les nombres x.', 'L’égalité est vraie seulement pour x = 0.', 'Il faudrait tester plusieurs valeurs pour être sûr.'], answer: 0},
    redaction: [{text: `{{${lhs} = ${S(`(x+${a})^2`)} - x^2 = ${rhs}}}`}, {text: 'On a transformé le membre de gauche en le membre de droite : l’égalité est vraie pour tout x.'}]
  };
}

function oddSum() {
  return {
    kind: 'proof',
    text: 'Démontre que la somme de deux nombres impairs consécutifs est toujours un multiple de 4.',
    hint: 'Un nombre impair s’écrit 2n + 1. L’impair suivant est 2 de plus.',
    steps: [
      {label: 'Un nombre impair s’écrit 2n + 1. L’impair suivant s’écrit :', answer: '2n + 3', check: 'equivalent'},
      {label: 'Leur somme, réduite :', answer: '4n + 4', check: 'expanded', from: '(2n+1)+(2n+3)'},
      {label: 'On met 4 en évidence :', answer: '4(n + 1)', check: 'multiple:4', from: '(2n+1)+(2n+3)'}
    ],
    conclusion: CONCLUDE_MULTIPLE(4, '4(n + 1)'),
    redaction: [{text: 'Soit n un entier. Deux impairs consécutifs s’écrivent {{2n + 1}} et {{2n + 3}}.'}, {text: 'Leur somme vaut {{(2n + 1) + (2n + 3) = 4n + 4 = 4(n + 1)}}, un multiple de 4.'}]
  };
}

function oddSquare() {
  return {
    kind: 'proof',
    text: 'Démontre que le carré d’un nombre impair est toujours impair.',
    hint: 'Développe (2n + 1)², puis écris le résultat sous la forme 2 · (…) + 1.',
    steps: [
      {label: 'Un nombre impair s’écrit 2n + 1. Son carré, développé :', answer: '4n^2 + 4n + 1', check: 'expanded', from: '(2n+1)^2'},
      {labelTex: '4n^{2} + 4n + 1 = 2\\cdot(\\;\\square\\;) + 1', label: 'Complète la parenthèse :', answer: '2n^2 + 2n', check: 'equivalent', from: '((2n+1)^2 - 1)/2'}
    ],
    conclusion: {question: 'Que peux-tu conclure ?', options: ['Le carré est de la forme 2k + 1 avec k entier : il est impair.', 'Le carré est pair car il contient 4n².', 'On ne peut pas savoir sans exemple.'], answer: 0},
    redaction: [{text: '{{(2n + 1)^2 = 4n^2 + 4n + 1 = 2(2n^2 + 2n) + 1}}'}, {text: 'Comme {{2n^2 + 2n}} est un entier, le carré est de la forme 2k + 1 : il est impair.'}]
  };
}

function counterExample(r) {
  const a = r.int(1, 4), b = r.int(1, 4);
  return {
    kind: 'proof',
    text: 'Vrai ou faux : « Pour tous nombres a et b, (a + b)² = a² + b² ». Teste avec un exemple.',
    hint: 'Remplace a et b par des nombres et calcule chaque membre séparément.',
    steps: [
      {label: `Avec a = ${a} et b = ${b}, calcule (a + b)² :`, answer: String((a + b) ** 2), check: 'number', from: `(${a}+${b})^2`},
      {label: `Avec a = ${a} et b = ${b}, calcule a² + b² :`, answer: String(a * a + b * b), check: 'number', from: `${a}^2+${b}^2`}
    ],
    conclusion: {question: 'Que peux-tu conclure ?', options: ['C’est faux : un seul contre-exemple suffit à le montrer.', 'C’est vrai pour tous les nombres.', 'C’est vrai si a et b sont positifs.'], answer: 0},
    redaction: [{text: `Avec a = ${a} et b = ${b} : {{(a + b)^2 = ${(a + b) ** 2}}} mais {{a^2 + b^2 = ${a * a + b * b}}}.`}, {text: 'L’affirmation est fausse. La bonne formule est {{(a + b)^2 = a^2 + 2ab + b^2}}.'}]
  };
}

function productTrick() {
  return {
    kind: 'proof',
    text: '« Choisis un nombre, multiplie-le par le nombre qui le suit, puis soustrais le carré du nombre choisi. » Démontre qu’on retrouve toujours le nombre choisi.',
    hint: 'Appelle n le nombre choisi. Le suivant est n + 1.',
    steps: [
      {label: 'Le produit du nombre par son suivant, développé :', answer: 'n^2 + n', check: 'expanded', from: 'n(n+1)'},
      {label: 'On soustrait le carré du nombre :', answer: 'n', check: 'expanded', from: 'n(n+1) - n^2'}
    ],
    conclusion: {question: 'Que peux-tu conclure ?', options: ['On retrouve toujours le nombre choisi.', 'On obtient toujours 1.', 'Cela dépend du nombre choisi.'], answer: 0},
    redaction: [{text: '{{n(n + 1) - n^2 = n^2 + n - n^2 = n}}'}, {text: 'On retrouve n, le nombre choisi.'}]
  };
}

function oddSquaresDiff() {
  return {
    kind: 'proof',
    text: 'Démontre que la différence des carrés de deux nombres impairs consécutifs est un multiple de 8.',
    hint: 'Écris (2n + 3)² − (2n + 1)², développe chaque carré puis réduis.',
    steps: [
      {label: 'Développe (2n + 3)² :', answer: '4n^2 + 12n + 9', check: 'expanded', from: '(2n+3)^2'},
      {label: 'Développe (2n + 1)² :', answer: '4n^2 + 4n + 1', check: 'expanded', from: '(2n+1)^2'},
      {label: 'La différence, réduite :', answer: '8n + 8', check: 'expanded', from: '(2n+3)^2-(2n+1)^2'},
      {label: 'On met 8 en évidence :', answer: '8(n + 1)', check: 'multiple:8', from: '(2n+3)^2-(2n+1)^2'}
    ],
    conclusion: CONCLUDE_MULTIPLE(8, '8(n + 1)'),
    redaction: [{text: '{{(2n + 3)^2 - (2n + 1)^2 = (4n^2 + 12n + 9) - (4n^2 + 4n + 1) = 8n + 8 = 8(n + 1)}}'}, {text: 'C’est 8 fois un entier : un multiple de 8.'}]
  };
}

function threeSquares() {
  return {
    kind: 'proof',
    text: 'Démontre que pour tout entier n, le nombre n² + (n + 1)² + (n + 2)² − 2 est un multiple de 3.',
    hint: 'Développe les carrés, réduis, puis mets 3 en évidence.',
    steps: [
      {label: 'L’expression développée et réduite :', answer: '3n^2 + 6n + 3', check: 'expanded', from: 'n^2+(n+1)^2+(n+2)^2-2'},
      {label: 'On met 3 en évidence :', answer: '3(n^2 + 2n + 1)', check: 'multiple:3', from: 'n^2+(n+1)^2+(n+2)^2-2'},
      {label: 'Et même, avec une identité remarquable : 3 · (…)² =', answer: '3(n + 1)^2', check: 'multiple:3', from: 'n^2+(n+1)^2+(n+2)^2-2'}
    ],
    conclusion: CONCLUDE_MULTIPLE(3, '3(n + 1)²'),
    redaction: [{text: '{{n^2 + (n + 1)^2 + (n + 2)^2 - 2 = n^2 + n^2 + 2n + 1 + n^2 + 4n + 4 - 2}}'}, {text: '{{= 3n^2 + 6n + 3 = 3(n^2 + 2n + 1) = 3(n + 1)^2}}, un multiple de 3.'}]
  };
}

function differenceTrick(r) {
  const base = r.pick([51, 61, 71, 101, 201]);
  return {
    kind: 'proof',
    text: `Démontre que pour tout nombre n : (n + 1)² − (n − 1)² = 4n. Utilise ensuite ce résultat pour calculer ${base}² − ${base - 2}² de tête.`,
    hint: 'Développe les deux carrés. Pour le calcul, cherche n tel que n + 1 = ' + base + '.',
    steps: [
      {label: '(n + 1)² − (n − 1)², développé et réduit :', answer: '4n', check: 'expanded', from: '(n+1)^2-(n-1)^2'},
      {label: `Pour ${base}² − ${base - 2}², quelle est la valeur de n ?`, answer: String(base - 1), check: 'number', from: `${base} - 1`},
      {label: `Donc ${base}² − ${base - 2}² =`, answer: String(4 * (base - 1)), check: 'number', from: `${base}^2 - ${base - 2}^2`}
    ],
    conclusion: {question: 'Que peux-tu conclure ?', options: [`L’égalité est vraie pour tout n, et ${base}² − ${base - 2}² = ${4 * (base - 1)}.`, 'L’égalité est vraie seulement pour les entiers pairs.', `On doit calculer ${base}² pour conclure.`], answer: 0},
    redaction: [{text: '{{(n + 1)^2 - (n - 1)^2 = (n^2 + 2n + 1) - (n^2 - 2n + 1) = 4n}}'}, {text: `Avec n = ${base - 1} : {{${base}^2 - ${base - 2}^2 = 4 \\cdot ${base - 1} = ${4 * (base - 1)}}}.`}]
  };
}

export const chapter5 = {
  id: 5,
  title: 'Prouver avec le calcul littéral',
  subtitle: 'Démontrer une propriété pour tous les nombres',
  rappel: [
    {tex: 'n,\\; n + 1,\\; n + 2', text: 'Trois entiers consécutifs'},
    {tex: '2n \\quad\\text{et}\\quad 2n + 1', text: 'Un nombre pair, un nombre impair'},
    {tex: 'k \\cdot (\\text{entier})', text: 'Un multiple de k'},
    {text: 'Un exemple ne prouve pas qu’une propriété est toujours vraie. Un seul contre-exemple suffit à prouver qu’elle est fausse.'}
  ],
  levels: {
    1: r => [{title: 'Démontre.', items: [consecutiveSum(r), calcProgram(r), identityProof(r)]}],
    2: r => [{title: 'Démontre.', items: [oddSum(), oddSquare(), counterExample(r), productTrick()]}],
    3: r => [{title: 'Démontre.', items: [oddSquaresDiff(), threeSquares(), differenceTrick(r)]}]
  }
};

// ======================= CHAPITRE 6 =======================
const perimeterItem = (sides, note) => {
  const src = sides.map(s => `(${s})`).join(' + ');
  return {kind: 'expr', text: 'Exprime le périmètre, sous forme réduite.', answer: S(src), from: src, check: 'expanded', unit: 'cm', hint: note || 'Additionne les longueurs de tous les côtés.', steps: [{src, note: 'Somme des côtés.'}, {src: S(src)}]};
};
const areaItem = (src, note, hint) => ({kind: 'expr', text: 'Exprime l’aire, sous forme développée réduite.', answer: S(src), from: src, check: 'expanded', unit: 'cm²', hint, steps: [{src, note}, {src: S(src)}]});

function rectangleFigure(r, hard = false) {
  const [L, l] = hard ? [lin(2, r.int(1, 5)), lin(1, -r.int(1, 3))] : [lin(1, r.int(2, 8)), 'x'];
  return {
    title: 'Rectangle',
    intro: `Ce rectangle mesure {{${L}}} cm de long et {{${l}}} cm de large.`,
    figure: {type: 'rect', w: 1.6, h: 1, top: L, right: l, unit: 'cm'},
    items: [perimeterItem([L, l, L, l], 'Périmètre = 2 × longueur + 2 × largeur.'), areaItem(`(${L})(${l})`, 'Longueur × largeur.', 'Aire du rectangle = longueur × largeur.')]
  };
}
function squareFigure(r, side) {
  return {
    title: 'Carré',
    intro: `Ce carré a un côté de {{${side}}} cm.`,
    figure: {type: 'square', side, unit: 'cm'},
    items: [perimeterItem([side, side, side, side], 'Périmètre = 4 × côté.'), areaItem(`(${side})^2`, 'Côté × côté.', side.length > 2 ? 'Aire = côté². Utilise une identité remarquable.' : 'Aire = côté × côté.')]
  };
}
function triangleFigure(r) {
  const eq = lin(2, r.int(1, 5)), base = lin(1, r.int(1, 6));
  return {
    title: 'Triangle isocèle',
    intro: `Ce triangle isocèle a deux côtés de {{${eq}}} cm et une base de {{${base}}} cm.`,
    figure: {type: 'triangle', sides: [eq, eq, base], unit: 'cm'},
    items: [perimeterItem([eq, eq, base])]
  };
}
function lShape(r) {
  const a = r.int(3, 6), b = r.int(1, 2), c = r.int(1, 3), d = r.int(1, 2);
  // grand rectangle (x + a) × (x + b), on enlève un rectangle c × d dans le coin
  const W = `x+${a}`, H = `x+${b}`;
  const area = `(${W})(${H}) - ${c * d}`;
  return {
    title: 'Figure en L',
    intro: `On découpe un rectangle de ${c} cm sur ${d} cm dans un coin d’un rectangle de {{${W}}} cm sur {{${H}}} cm.`,
    figure: {type: 'lshape', W, H, cut: [String(c), String(d)], unit: 'cm'},
    items: [
      areaItem(area, `Grand rectangle − petit rectangle (${c} · ${d} = ${c * d}).`, 'Aire du grand rectangle moins aire du morceau découpé.'),
      {kind: 'expr', text: 'Exprime le périmètre de la figure, réduit.', answer: S(`2*(${W})+2*(${H})`), from: `2*(${W})+2*(${H})`, check: 'expanded', unit: 'cm', hint: 'Astuce : les deux petits côtés du coin découpé remplacent exactement les morceaux enlevés. Le périmètre est celui du grand rectangle.', steps: [{text: 'Les deux côtés du coin découpé ont la même longueur totale que les morceaux enlevés.'}, {src: `2(${W}) + 2(${H})`}, {src: S(`2*(${W})+2*(${H})`)}]}
    ]
  };
}
function gardenPath(r) {
  const extra = r.int(2, 6), w = r.int(1, 2), xv = r.pick([8, 10, 12, 15]);
  const inner = `x(x+${extra})`, outer = `(x+${2 * w})(x+${extra + 2 * w})`;
  const path = `${outer} - ${inner}`;
  const val = (xv + 2 * w) * (xv + extra + 2 * w) - xv * (xv + extra);
  return {
    title: 'L’allée du jardin',
    intro: `Un jardin rectangulaire mesure {{x}} m sur {{x + ${extra}}} m. Il est entouré d’une allée de ${w} m de large (en couleur).`,
    figure: {type: 'frame', innerW: `x+${extra}`, innerH: 'x', width: String(w), unit: 'm'},
    items: [
      {kind: 'expr', text: 'Exprime les dimensions extérieures : la longueur totale (jardin + allée).', answer: `x + ${extra + 2 * w}`, check: 'equivalent', unit: 'm', hint: `L’allée ajoute ${w} m de chaque côté.`, steps: [{src: `x + ${extra} + 2*${w}`}, {src: `x + ${extra + 2 * w}`}]},
      {kind: 'expr', text: 'Exprime l’aire de l’allée, réduite.', answer: S(path), from: path, check: 'expanded', unit: 'm²', hint: 'Aire du grand rectangle (avec l’allée) − aire du jardin.', steps: [{src: path, note: 'Grand rectangle − jardin.'}, {src: `(${S(outer)}) - (${S(inner)})`}, {src: S(path)}]},
      {kind: 'expr', text: `Calcule l’aire de l’allée si {{x = ${xv}}}.`, answer: String(val), from: `(${xv}+${2 * w})*(${xv}+${extra + 2 * w}) - ${xv}*(${xv}+${extra})`, check: 'number', unit: 'm²', hint: `Remplace x par ${xv} dans l’expression réduite.`, steps: [{src: `${4 * w}*${xv} + ${2 * w * (extra + 2 * w)}`, note: `On remplace x par ${xv} dans ${S(path)}.`}, {src: String(val)}]}
    ]
  };
}
function cornerSquare(r) {
  const c = r.int(2, 5), xv = r.int(c + 3, 12);
  return {
    title: 'Carré troué',
    intro: `Dans un carré de côté {{x}} cm, on enlève un carré de côté ${c} cm dans un coin.`,
    figure: {type: 'lshape', W: 'x', H: 'x', cut: [String(c), String(c)], unit: 'cm'},
    items: [
      {kind: 'expr', text: 'Exprime l’aire restante.', answer: `x^2 - ${c * c}`, check: 'expanded', unit: 'cm²', hint: 'Grand carré − petit carré.', steps: [{src: `x^2 - ${c}^2`}, {src: `x^2 - ${c * c}`}]},
      {kind: 'expr', text: 'Factorise cette aire.', prompt: `x^2 - ${c * c}`, answer: `(x - ${c})(x + ${c})`, check: 'factored', hint: 'Différence de deux carrés.', steps: [{src: `x^2 - ${c}^2`}, {src: `(x - ${c})(x + ${c})`, note: 'a² − b² = (a − b)(a + b)'}]},
      {kind: 'expr', text: 'Exprime le périmètre de la figure.', answer: '4x', check: 'expanded', unit: 'cm', hint: 'Regarde bien le coin : les deux côtés du trou remplacent les deux morceaux enlevés.', steps: [{text: `Les deux côtés du trou (${c} cm chacun) remplacent exactement les deux morceaux de ${c} cm enlevés.`}, {src: '4x'}]},
      {kind: 'expr', text: `Calcule l’aire restante pour {{x = ${xv}}}.`, answer: String(xv * xv - c * c), from: `${xv}^2 - ${c * c}`, check: 'number', unit: 'cm²', hint: 'Avec la forme factorisée, c’est un simple produit.', steps: [{src: `(${xv} - ${c})(${xv} + ${c})`}, {src: `${xv - c}*${xv + c}`}, {src: String(xv * xv - c * c)}]}
    ]
  };
}
function trapezoid(r) {
  const [k, m] = coprime(r, [() => r.int(2, 4), () => r.int(1, 6)]);
  const b1 = lin(1, m), b2 = `${k}x`, h = 2 * r.int(1, 3);
  const area = `((${b1}) + (${b2}))*${h}/2`;
  return {
    title: 'Trapèze',
    intro: `Ce trapèze a deux bases de {{${b1}}} cm et {{${b2}}} cm, et une hauteur de ${h} cm.`,
    figure: {type: 'trapezoid', top: b1, bottom: b2, h: String(h), unit: 'cm'},
    items: [areaItem(area, 'Aire du trapèze = (grande base + petite base) × hauteur ÷ 2.', 'Aire du trapèze = (B + b) × h ÷ 2.')]
  };
}

export const chapter6 = {
  id: 6,
  title: 'Aires et périmètres',
  subtitle: 'Exprimer des grandeurs géométriques avec des lettres',
  rappel: [
    {tex: 'P = 2L + 2l \\qquad A = L \\cdot l', text: 'Rectangle'},
    {tex: 'P = 4c \\qquad A = c^{2}', text: 'Carré'},
    {tex: 'A = \\frac{(B + b) \\cdot h}{2}', text: 'Trapèze'},
    {text: 'Pour une figure composée : additionne ou soustrais les aires des morceaux.'}
  ],
  levels: {
    1: r => [rectangleFigure(r), squareFigure(r, `${r.int(2, 5)}a`), triangleFigure(r)],
    2: r => [rectangleFigure(r, true), lShape(r), squareFigure(r, lin(1, r.int(2, 7)))],
    3: r => [gardenPath(r), cornerSquare(r), trapezoid(r)]
  }
};

export {gardenPath, lShape};
