// Cours de révision : une à deux pages par chapitre, pour reprendre le sujet depuis le début.
// Blocs : h (titre), p (paragraphe), f (formule encadrée), ex (exemple résolu), method (étapes),
// warn (erreurs fréquentes), tip (astuce), table, try (exercice « À toi », vérifié comme les autres).

export const cours = {
  1: [
    {h: 'Développer, c’est quoi ?'},
    {p: 'Une expression comme {{3(x + 4)}} est un **produit** : on multiplie 3 par la parenthèse. **Développer**, c’est la transformer en **somme** : {{3(x + 4) = 3x + 12}}. **Réduire**, c’est ensuite regrouper les termes qui se ressemblent pour écrire le résultat le plus court possible.'},
    {h: '1. Multiplier des monômes'},
    {p: 'Un monôme est un nombre multiplié par des lettres, comme {{5x^2}} ou {{-3ab}}. Pour multiplier deux monômes, on multiplie **les nombres entre eux**, puis **les lettres entre elles**.'},
    {f: 'x^{m} \\cdot x^{n} = x^{m + n}', c: 'Avec la même lettre, on additionne les exposants : x² · x³ = (x·x)·(x·x·x) = x⁵.'},
    {ex: {title: 'Exemple', prompt: '-3x*4x^2', steps: [{src: '(-3)*4*x*x^2', note: 'On regroupe les nombres et les lettres.'}, {src: '-12x^3', note: '(−3) · 4 = −12 et x · x² = x³.'}]}},
    {p: 'Règle des signes : {{tex:(+)\\cdot(+) = +}}, {{tex:(-)\\cdot(-) = +}}, mais {{tex:(+)\\cdot(-) = -}}.'},
    {h: '2. La distributivité simple'},
    {f: 'k\\,(a + b) = k\\,a + k\\,b', c: 'Le facteur devant la parenthèse multiplie CHAQUE terme de la parenthèse.'},
    {ex: {title: 'Exemple', prompt: '-4(2x - 5)', steps: [{src: '(-4)*2x + (-4)*(-5)', note: '−4 multiplie 2x, puis −4 multiplie −5.'}, {src: '-8x + 20', note: '(−4)·(−5) = +20 : moins par moins donne plus.'}]}},
    {p: 'Cas particulier : un signe − seul devant une parenthèse, c’est « −1 fois ». Il change le signe de chaque terme : {{-(x - 3) = -x + 3}}.'},
    {h: '3. La double distributivité'},
    {f: '(a + b)(c + d) = ac + ad + bc + bd', c: 'Chaque terme du premier facteur multiplie chaque terme du second : 2 × 2 = 4 produits.'},
    {method: {title: 'Méthode en 3 étapes', list: [
      'Écrire tous les produits, avec leur signe. Compter : 2 termes × 2 termes = 4 produits ; 2 × 3 = 6 produits.',
      'Calculer chaque produit.',
      'Réduire (regrouper les termes semblables) et ordonner : x², puis x, puis le nombre seul.'
    ]}},
    {ex: {title: 'Exemple', prompt: '(2x + 3)(x - 4)', steps: [{src: '2x*x + 2x*(-4) + 3*x + 3*(-4)', note: 'Les 4 produits.'}, {src: '2x^2 - 8x + 3x - 12', note: 'On calcule chaque produit.'}, {src: '2x^2 - 5x - 12', note: 'On réduit : −8x + 3x = −5x.'}]}},
    {p: 'Avec une soustraction de produits, on développe chaque produit **entre parenthèses**, puis on enlève les parenthèses en faisant attention au signe −.'},
    {ex: {title: 'Exemple', prompt: '(x + 1)(x + 2) - (x - 3)(x + 4)', steps: [{src: '(x^2 + 3x + 2) - (x^2 + x - 12)', note: 'Chaque produit développé, gardé entre parenthèses.'}, {src: 'x^2 + 3x + 2 - x^2 - x + 12', note: 'Le − change tous les signes de la seconde parenthèse.'}, {src: '2x + 14', note: 'On réduit.'}]}},
    {warn: [
      '{{3(x + 4) = 3x + 4}} est FAUX : le 3 doit aussi multiplier le 4. On obtient {{3x + 12}}.',
      '{{-2(x - 5) = -2x - 10}} est FAUX : {{(-2)·(-5) = +10}}, donc {{-2x + 10}}.',
      '{{(x + 3)^2 = x^2 + 9}} est FAUX : {{(x + 3)^2 = (x + 3)(x + 3)}} donne 4 produits (voir chapitre 3).'
    ]},
    {tip: 'Pour vérifier un développement, remplace x par un petit nombre (par exemple 2) dans l’expression de départ ET dans ta réponse : tu dois trouver le même résultat.'},
    {try: {text: 'À toi : développe et réduis.', prompt: '(x - 2)(3x + 1)', answer: '3x^2 - 5x - 2', check: 'expanded', hint: '4 produits : x·3x, x·1, (−2)·3x et (−2)·1.', steps: [{src: 'x*3x + x*1 + (-2)*3x + (-2)*1'}, {src: '3x^2 + x - 6x - 2'}, {src: '3x^2 - 5x - 2'}]}}
  ],

  2: [
    {h: 'Le vocabulaire'},
    {p: 'Un **monôme** est un produit d’un nombre et de lettres : {{5x^2}}, {{-3ab}}, {{7}}. Le nombre s’appelle le **coefficient** (5, −3, 7) et les lettres forment la **partie littérale** ({{x^2}}, {{ab}}). Un **polynôme** est une somme de monômes : {{2x^2 - 5x + 1}}.'},
    {h: '1. Les termes semblables'},
    {p: 'Deux termes sont **semblables** s’ils ont exactement la même partie littérale : les mêmes lettres, avec les mêmes exposants.'},
    {table: {head: ['Termes', 'Semblables ?', 'Pourquoi'], rows: [
      ['{{3x^2}} et {{-7x^2}}', 'oui', 'même partie littérale {{x^2}}'],
      ['{{3x^2}} et {{3x}}', 'non', '{{x^2}} et {{x}} sont différents'],
      ['{{2ab}} et {{5ba}}', 'oui', '{{ba = ab}}'],
      ['{{4x}} et {{4}}', 'non', 'le 4 seul n’a pas de lettre']
    ]}},
    {h: '2. Réduire'},
    {p: 'Réduire, c’est **additionner les coefficients** des termes semblables, et seulement d’eux. C’est comme compter des objets : 5 pommes + 3 pommes − 1 pomme = 7 pommes. Mais 3 pommes + 2 poires restent 3 pommes + 2 poires.'},
    {f: '5x + 3x - x = (5 + 3 - 1)\\,x = 7x', c: 'On additionne les coefficients, la partie littérale ne change pas.'},
    {ex: {title: 'Exemple', prompt: '2x^2 + 3x - x^2 + 5x - 4', steps: [{src: '2x^2 - x^2 + 3x + 5x - 4', note: 'On regroupe les familles : les x², puis les x, puis les nombres.'}, {src: 'x^2 + 8x - 4', note: '2x² − x² = x² et 3x + 5x = 8x.'}]}},
    {h: '3. Enlever des parenthèses'},
    {method: {title: 'La règle', list: [
      'Parenthèse précédée d’un + : on l’enlève sans rien changer.',
      'Parenthèse précédée d’un − : on l’enlève en changeant le signe de CHAQUE terme à l’intérieur.',
      'Crochets et parenthèses les uns dans les autres : on commence par l’intérieur.'
    ]}},
    {ex: {title: 'Exemple', prompt: '(3x^2 - 2x + 1) - (x^2 + 5x - 4)', steps: [{src: '3x^2 - 2x + 1 - x^2 - 5x + 4', note: 'Les signes de la seconde parenthèse changent tous.'}, {src: '2x^2 - 7x + 5', note: 'On réduit chaque famille.'}]}},
    {ex: {title: 'Exemple avec crochets', prompt: '2x - [3 - (x - 4)]', steps: [{src: '2x - [3 - x + 4]', note: 'D’abord la parenthèse intérieure.'}, {src: '2x - [7 - x]', note: 'On réduit dans les crochets.'}, {src: '2x - 7 + x', note: 'Le − devant les crochets change les signes.'}, {src: '3x - 7'}]}},
    {warn: [
      '{{3x + 2 = 5x}} est FAUX : 3x et 2 ne sont pas semblables, {{3x + 2}} est déjà réduit.',
      '{{x^2 + x^2 = x^4}} est FAUX : on additionne les coefficients, {{x^2 + x^2 = 2x^2}}.',
      '{{-(a - b) = -a - b}} est FAUX : le − change aussi le signe de −b, donc {{-a + b}}.'
    ]},
    {tip: 'Sur ton brouillon, souligne chaque famille d’une couleur différente (les x² en bleu, les x en rouge, les nombres en vert). À la fin, il doit rester un seul terme par couleur.'},
    {try: {text: 'À toi : réduis.', prompt: '(2a - 3b) - (a - 4b)', answer: 'a + b', check: 'expanded', hint: 'Enlève la seconde parenthèse en changeant les signes : −a + 4b.', steps: [{src: '2a - 3b - a + 4b'}, {src: 'a + b'}]}}
  ],

  3: [
    {h: 'Pourquoi des identités « remarquables » ?'},
    {p: 'Certains produits reviennent tout le temps. Au lieu de refaire la double distributivité, on retient le résultat : ce sont les **identités remarquables**. Elles servent dans les deux sens : pour **développer** vite, et pour **factoriser**.'},
    {f: '(a + b)^{2} = a^{2} + 2ab + b^{2}', c: 'Carré d’une somme.'},
    {f: '(a - b)^{2} = a^{2} - 2ab + b^{2}', c: 'Carré d’une différence.'},
    {f: '(a + b)(a - b) = a^{2} - b^{2}', c: 'Produit d’une somme par une différence.'},
    {p: 'D’où vient la première ? On développe : {{(a + b)^2 = (a + b)(a + b) = a^2 + ab + ba + b^2 = a^2 + 2ab + b^2}}. Le terme du milieu, {{2ab}}, s’appelle le **double produit**.'},
    {h: '1. Développer avec une identité'},
    {method: {title: 'Méthode', list: [
      'Reconnaître l’identité : carré d’une somme, d’une différence, ou somme × différence.',
      'Repérer a et b (ils peuvent contenir des nombres et des lettres, par exemple a = 3x).',
      'Remplacer dans la formule, avec des parenthèses autour de a et de b, puis calculer.'
    ]}},
    {ex: {title: 'Exemple', prompt: '(3x - 2)^2', steps: [{src: '(3x)^2 - 2*3x*2 + 2^2', note: 'a = 3x et b = 2 dans (a − b)² = a² − 2ab + b².'}, {src: '9x^2 - 12x + 4', note: '(3x)² = 9x² : on élève aussi le 3 au carré.'}]}},
    {ex: {title: 'Exemple', prompt: '(2x + 5)(2x - 5)', steps: [{src: '(2x)^2 - 5^2', note: 'a = 2x et b = 5 dans (a + b)(a − b) = a² − b².'}, {src: '4x^2 - 25'}]}},
    {h: '2. Factoriser avec une identité'},
    {p: '**Deux carrés séparés par un −** : c’est {{a^2 - b^2 = (a - b)(a + b)}}. Exemple : {{x^2 - 49 = (x - 7)(x + 7)}}, car {{49 = 7^2}}.'},
    {p: '**Trois termes dont deux carrés** : on vérifie si le terme du milieu est le double produit.'},
    {ex: {title: 'Exemple', prompt: 'x^2 + 10x + 25', steps: [{text: 'Les carrés : {{x^2}} et {{25 = 5^2}}. Le double produit : {{2·x·5 = 10x}}. C’est bien le terme du milieu.'}, {src: '(x + 5)^2', note: 'Donc c’est (a + b)² avec a = x et b = 5.'}]}},
    {h: '3. Calcul mental astucieux'},
    {p: '{{102^2 = (100 + 2)^2 = 10000 + 400 + 4 = 10404}} et {{49 · 51 = (50 - 1)(50 + 1) = 2500 - 1 = 2499}}.'},
    {warn: [
      '{{(a + b)^2 = a^2 + b^2}} est FAUX : il manque le double produit. Test avec a = b = 1 : 4 d’un côté, 2 de l’autre.',
      '{{(3x)^2 = 3x^2}} est FAUX : {{(3x)^2 = 3x · 3x = 9x^2}}.',
      '{{a^2 + b^2}} (une SOMME de carrés) ne se factorise pas avec les identités.'
    ]},
    {tip: 'Pour vérifier une factorisation, redéveloppe ta réponse : tu dois retrouver l’expression de départ.'},
    {try: {text: 'À toi : factorise.', prompt: '9x^2 - 16', answer: '(3x - 4)(3x + 4)', check: 'factored', hint: '9x² = (3x)² et 16 = 4² : différence de deux carrés.', steps: [{src: '(3x)^2 - 4^2'}, {src: '(3x - 4)(3x + 4)'}]}}
  ],

  4: [
    {h: 'Factoriser, c’est l’inverse de développer'},
    {p: 'Factoriser, c’est transformer une **somme** en **produit** : {{6x + 9 = 3(2x + 3)}}. C’est utile pour simplifier, pour calculer plus vite, et pour prouver qu’un nombre est un multiple (chapitre 5).'},
    {h: '1. La mise en évidence'},
    {f: 'k\\,a + k\\,b = k\\,(a + b)', c: 'On « sort » ce qui est commun à tous les termes.'},
    {method: {title: 'Trouver le facteur commun', list: [
      'Le nombre : le plus grand nombre qui divise tous les coefficients.',
      'Les lettres : celles qui sont dans tous les termes, avec le plus petit exposant.',
      'Dans la parenthèse : chaque terme divisé par le facteur commun.'
    ]}},
    {ex: {title: 'Exemple', prompt: '12x^3 - 8x^2', steps: [{src: '4x^2*3x - 4x^2*2', note: '4 divise 12 et 8 ; x² est dans les deux termes.'}, {src: '4x^2(3x - 2)'}]}},
    {p: 'Le facteur commun peut être une parenthèse entière : {{3x(x + 2) + 5(x + 2) = (x + 2)(3x + 5)}}.'},
    {h: '2. Les identités remarquables (rappel)'},
    {p: '{{a^2 - b^2 = (a - b)(a + b)}}, {{a^2 + 2ab + b^2 = (a + b)^2}}, {{a^2 - 2ab + b^2 = (a - b)^2}}. Voir le cours du chapitre 3.'},
    {h: '3. Le trinôme unitaire'},
    {p: 'Un trinôme **unitaire** commence par {{x^2}} (coefficient 1) : {{x^2 + sx + p}}. On cherche deux nombres m et n dont la **somme** vaut s et le **produit** vaut p.'},
    {f: 'x^{2} + s\\,x + p = (x + m)(x + n) \\quad\\text{avec}\\quad m + n = s,\\; m \\cdot n = p', c: ''},
    {ex: {title: 'Exemple', prompt: 'x^2 - x - 12', steps: [{text: 'Produit −12 : un nombre positif et un négatif. Somme −1 : le négatif est le plus grand en valeur. Les paires de produit −12 : (1 ; −12), (2 ; −6), (3 ; −4)… La somme de 3 et −4 vaut −1 : ce sont m = 3 et n = −4.'}, {src: '(x + 3)(x - 4)'}]}},
    {h: '4. Factoriser complètement'},
    {method: {title: 'Ordre de réflexion', list: [
      'Y a-t-il un facteur commun ? Si oui, le mettre en évidence d’abord.',
      'Ce qui reste a 2 termes ? Pense à a² − b².',
      'Ce qui reste a 3 termes ? Carré parfait (a ± b)², ou trinôme unitaire.',
      'Regarde chaque facteur : peut-il encore se factoriser ? Si non, c’est fini.'
    ]}},
    {ex: {title: 'Exemple', prompt: '3x^2 - 27', steps: [{src: '3(x^2 - 9)', note: 'Facteur commun 3.'}, {src: '3(x - 3)(x + 3)', note: 'x² − 9 est une différence de deux carrés.'}]}},
    {warn: [
      '{{6x + 3 = 3·2x}} est FAUX : il ne faut pas perdre de terme. {{6x + 3 = 3(2x + 1)}}.',
      '{{2x^2 - 8 = 2(x^2 - 4)}} n’est pas terminé : {{x^2 - 4}} se factorise encore en {{(x - 2)(x + 2)}}.',
      '{{x^2 + 5x + 6 = (x + 1)(x + 6)}} est FAUX : le produit est bon (6) mais la somme vaut 7. Il faut 2 et 3.'
    ]},
    {tip: 'Une factorisation se vérifie toujours en redéveloppant : tu dois retrouver exactement l’expression de départ.'},
    {try: {text: 'À toi : factorise complètement.', prompt: '2x^2 + 12x + 18', answer: '2(x + 3)^2', check: 'factored', hint: 'Mets d’abord 2 en évidence, puis regarde le trinôme qui reste.', steps: [{src: '2(x^2 + 6x + 9)'}, {src: '2(x + 3)^2'}]}}
  ],

  5: [
    {h: 'Pourquoi utiliser des lettres pour prouver ?'},
    {p: 'Tu veux montrer que « la somme de trois entiers consécutifs est un multiple de 3 ». Tu essaies : {{1 + 2 + 3 = 6}}, {{10 + 11 + 12 = 33}}… Ça marche, mais **des exemples ne prouvent rien** : il y a une infinité de nombres, tu ne peux pas tous les essayer. Avec une lettre, on traite **tous les nombres d’un coup**.'},
    {h: '1. Traduire en lettres'},
    {table: {head: ['En mots', 'En lettres'], rows: [
      ['un nombre entier', '{{n}}'],
      ['le nombre suivant, le précédent', '{{n + 1}}, {{n - 1}}'],
      ['trois entiers consécutifs', '{{n}}, {{n + 1}}, {{n + 2}}'],
      ['un nombre pair', '{{2n}}'],
      ['un nombre impair', '{{2n + 1}}'],
      ['deux impairs consécutifs', '{{2n + 1}} et {{2n + 3}}'],
      ['un multiple de 5', '{{5k}} (k entier)'],
      ['deux nombres pairs quelconques', '{{2n}} et {{2m}} (deux lettres différentes !)']
    ]}},
    {h: '2. Prouver qu’un nombre est un multiple de k'},
    {p: 'On calcule, on réduit, puis on factorise pour arriver à la forme {{tex:k \\cdot (\\text{nombre entier})}}.'},
    {ex: {title: 'Exemple : la somme de trois entiers consécutifs', prompt: 'n + (n + 1) + (n + 2)', steps: [{src: '3n + 3', note: 'On réduit.'}, {src: '3(n + 1)', note: 'On met 3 en évidence.'}, {text: 'Comme {{n + 1}} est un nombre entier, la somme vaut 3 fois un entier : c’est un multiple de 3, pour tous les entiers n.'}]}},
    {h: '3. Prouver qu’une égalité est toujours vraie'},
    {p: 'On transforme un membre (en général celui qui est le plus compliqué) jusqu’à obtenir l’autre. Tu ne dois **pas** partir de l’égalité à démontrer comme si elle était déjà vraie.'},
    {ex: {title: 'Exemple : montrer que (x + 1)² − (x − 1)² = 4x', prompt: '(x + 1)^2 - (x - 1)^2', steps: [{src: '(x^2 + 2x + 1) - (x^2 - 2x + 1)', note: 'On développe chaque carré.'}, {src: 'x^2 + 2x + 1 - x^2 + 2x - 1', note: 'On enlève les parenthèses.'}, {src: '4x', note: 'On réduit : on retrouve le membre de droite.'}]}},
    {h: '4. Prouver qu’une affirmation est fausse'},
    {p: 'Un **seul contre-exemple** suffit. « {{(a + b)^2 = a^2 + b^2}} pour tous a, b » est faux : avec {{a = 1}} et {{b = 1}}, on obtient 4 d’un côté et 2 de l’autre.'},
    {h: '5. Programmes de calcul'},
    {p: 'On appelle x le nombre choisi et on écrit chaque étape avec x. « Choisis un nombre, ajoute 3, multiplie par 2, soustrais 6 » : {{x → x + 3 → 2(x + 3) = 2x + 6 → 2x}}. On obtient toujours le double du nombre choisi.'},
    {method: {title: 'Une rédaction modèle', list: [
      'Soit n un nombre entier. (On présente la lettre.)',
      'On écrit les nombres de l’énoncé avec n.',
      'On calcule, on réduit, on factorise.',
      'Donc … (On conclut par une phrase qui répond à la question.)'
    ]}},
    {warn: [
      'Vérifier sur des exemples n’est PAS une preuve (sauf pour montrer qu’une affirmation est fausse).',
      'Deux nombres quelconques demandent deux lettres : {{2n}} et {{2m}}. Avec {{2n}} et {{2n}}, tu prendrais deux fois le même nombre !',
      'N’oublie pas la phrase de conclusion.'
    ]},
    {try: {text: 'À toi : la somme de deux nombres pairs 2n et 2m, mise sous la forme 2 · (…).', prompt: '2n + 2m', answer: '2(n + m)', check: 'multiple:2', hint: 'Mets 2 en évidence.', steps: [{src: '2(n + m)', note: 'Comme n + m est un entier, la somme est paire.'}]}}
  ],

  6: [
    {h: 'Les formules à connaître'},
    {table: {head: ['Figure', 'Périmètre', 'Aire'], rows: [
      ['Rectangle (longueur L, largeur l)', '{{tex:2L + 2l}}', '{{tex:L \\cdot l}}'],
      ['Carré (côté c)', '{{4c}}', '{{c^2}}'],
      ['Triangle (base b, hauteur h)', 'somme des 3 côtés', '{{tex:\\dfrac{b \\cdot h}{2}}}'],
      ['Trapèze (bases B et b, hauteur h)', 'somme des 4 côtés', '{{tex:\\dfrac{(B + b) \\cdot h}{2}}}']
    ]}},
    {p: 'Le **périmètre** est une longueur (en cm, en m), c’est le tour de la figure. L’**aire** est une surface (en cm², en m²).'},
    {h: '1. Quand les côtés sont des expressions'},
    {method: {title: 'Méthode', list: [
      'Écrire la formule avec des mots ou des lettres (par exemple aire = longueur × largeur).',
      'Remplacer chaque longueur par son expression, ENTRE PARENTHÈSES.',
      'Développer et réduire.'
    ]}},
    {ex: {title: 'Exemple : rectangle de longueur 2x + 3 et de largeur x − 1 (périmètre)', prompt: '2(2x + 3) + 2(x - 1)', steps: [{src: '4x + 6 + 2x - 2'}, {src: '6x + 4'}]}},
    {ex: {title: 'Même rectangle : son aire', prompt: '(2x + 3)(x - 1)', steps: [{src: '2x*x + 2x*(-1) + 3*x + 3*(-1)'}, {src: '2x^2 - 2x + 3x - 3'}, {src: '2x^2 + x - 3'}]}},
    {h: '2. Figures composées'},
    {p: 'On découpe la figure en morceaux simples. On **additionne** les aires des morceaux, ou on **soustrait** l’aire d’un trou.'},
    {ex: {title: 'Exemple : un carré de côté x + 4 dont on enlève un carré de côté x', prompt: '(x + 4)^2 - x^2', steps: [{src: '(x^2 + 8x + 16) - x^2', note: 'Identité remarquable pour le grand carré.'}, {src: '8x + 16'}, {src: '8(x + 2)', note: 'On peut aussi factoriser.'}]}},
    {tip: 'Figure en L (un rectangle auquel on a enlevé un coin) : son périmètre est le même que celui du rectangle entier. Les deux côtés du coin découpé remplacent exactement les deux morceaux enlevés.'},
    {h: '3. Calculer pour une valeur de x'},
    {p: 'On remplace x par le nombre dans l’expression la plus simple, en respectant les priorités. Pour {{x = 5}} : {{6x + 4 = 6 · 5 + 4 = 34}} cm. Les longueurs doivent rester positives : avec un côté {{x - 1}}, il faut {{x > 1}}.'},
    {warn: [
      '{{2 · 2x + 3}} n’est pas {{2(2x + 3)}} : sans parenthèses, le 2 ne multiplie que 2x.',
      'Le périmètre d’un carré de côté {{x + 3}} est {{4(x + 3) = 4x + 12}}, pas {{4x + 3}}.',
      'Ne mélange pas les unités : une aire en cm², un périmètre en cm.'
    ]},
    {try: {text: 'À toi : un carré a pour côté 3x − 1. Exprime son aire, développée et réduite.', prompt: '(3x - 1)^2', answer: '9x^2 - 6x + 1', check: 'expanded', hint: 'Aire = côté², puis (a − b)² = a² − 2ab + b².', steps: [{src: '(3x)^2 - 2*3x*1 + 1^2'}, {src: '9x^2 - 6x + 1'}]}}
  ]
};
