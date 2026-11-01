// Sommaire : les 6 chapitres, leurs 3 niveaux, et le mode Master.
import {makeRng} from './helpers.js';
import {chapter1, chapter2} from './ch1-2.js';
import {chapter3, chapter4} from './ch3-4.js';
import {chapter5, chapter6} from './ch5-6.js';
import {masterTest} from './master.js';

export const chapters = [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6];
export const LEVELS = [
  {n: 1, name: 'Niveau 1', sub: 'Les bases'},
  {n: 2, name: 'Niveau 2', sub: 'Entraînement'},
  {n: 3, name: 'Niveau 3', sub: 'Approfondir'}
];

const letter = i => 'abcdefghijklmnopqrstuvwxyz'[i];

// Construit une série (liste d'exercices numérotés, items identifiés) à partir d'une graine
function finalize(exercises, prefix) {
  return exercises.map((ex, e) => ({
    ...ex,
    number: e + 1,
    items: ex.items.map((it, i) => ({...it, id: `${prefix}.${e + 1}${letter(i)}`, label: ex.items.length > 1 ? `${letter(i)})` : ''}))
  }));
}

export function buildSeries(chapterId, level, seed) {
  const ch = chapters.find(c => c.id === chapterId);
  return finalize(ch.levels[level](makeRng(seed * 7919 + chapterId * 131 + level)), `${chapterId}.${level}`);
}

export function buildMaster(seed) {
  return finalize(masterTest(makeRng(seed * 104729 + 77)), 'M');
}

export const itemCount = exercises => exercises.reduce((n, ex) => n + ex.items.length, 0);
