# Calcul littéral

Cahier d’exercices interactif pour préparer le test de calcul littéral de Daniel (11VG). React + Vite, utilisable sur ordinateur et sur téléphone.

## Contenu

Six chapitres, qui suivent les objectifs du test, chacun en trois niveaux :

1. **Développements** : distributivité, double distributivité, produits de polynômes.
2. **Réductions** : addition et soustraction de monômes et de polynômes, parenthèses et crochets.
3. **Identités remarquables** : développer et factoriser, calcul mental astucieux.
4. **Factorisation** : mise en évidence, identités, trinôme unitaire, factoriser complètement.
5. **Prouver avec le calcul littéral** : démonstrations guidées (entiers consécutifs, pairs et impairs, programmes de calcul, contre-exemple).
6. **Aires et périmètres** : rectangles, carrés, triangles, figures en L, allée autour d’un jardin, trapèze.

Chaque niveau contient des exercices et des problèmes (cinéma, jardin, terrain, achats, âges, boîte…). Le **mode Master** est un test blanc de 17 questions plus difficiles, sans indice, corrigé à la fin avec les points et une note indicative.

## Comment ça marche

- On écrit la réponse comme dans un cahier : `2x^2-5x-12`, `2x²`, `(x+3)(x-3)`, `3(2x+5)`, `1/2x`, `0,5x`. La ligne « Lecture » montre comment l’appli a compris la saisie. Sur téléphone, une barre de touches (x, ², parenthèses…) aide à écrire.
- « Vérifier » compare la réponse à la bonne, quelle que soit l’écriture choisie, et contrôle la forme demandée : une réponse égale mais pas réduite, ou pas complètement factorisée, est signalée comme telle. Les erreurs de signe et les termes oubliés sont repérés.
- « Indice » donne une piste, « Corrigé » montre le calcul détaillé ligne par ligne, « Brouillon » ouvre une zone de notes.
- « Nouvelle série » tire de nouveaux nombres : on peut s’entraîner autant qu’on veut.
- Pas de récompenses ni de scores : seulement une barre de progression par série. Les réponses sont gardées dans le navigateur (localStorage), sans compte ni envoi.

## Lancer

Windows : double-cliquer sur `START-CALCUL.cmd` (Node.js 20.19+ ou 22.12+).

```sh
npm install
npm run dev      # http://localhost:5185
```

## Vérifications

`npm test` vérifie l’algèbre (lecture des expressions, formes développée et factorisée) et tout le contenu sur 40 séries tirées au hasard par niveau, et 40 tests blancs : chaque réponse attendue est juste et dans la bonne forme, chaque ligne de chaque corrigé est égale à l’expression de départ, et chaque formule s’affiche.

## Publication

`.github/workflows/pages.yml` teste, construit et publie le site sur GitHub Pages à chaque envoi sur `main`. Une seule fois dans le dépôt : **Settings > Pages > Source : GitHub Actions**. Adresse : https://efradet.github.io/calcul-litteral/

Fichiers : moteur algébrique `src/algebra.js`, exercices `src/content/`, interface `src/ui/`, styles `src/styles.css`.
