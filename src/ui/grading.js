// Correction d'un exercice à partir de ce que l'élève a écrit (partagé entre entraînement et mode Master).
import {checkAnswer} from '../algebra.js';

export function gradeExpr(item, value) {
  return checkAnswer(value, item.answer, item.check);
}

export function gradeProofStep(step, value) {
  return checkAnswer(value, step.answer, step.check);
}

// Points (sur 1) d'un exercice, pour le mode Master
export function itemPoints(item, st = {}) {
  if (item.kind === 'expr') {
    const r = gradeExpr(item, st.value);
    return r.status === 'right' ? 1 : r.status === 'form' ? 0.5 : 0;
  }
  if (item.kind === 'choice') return st.choice === item.answer ? 1 : 0;
  if (item.kind === 'proof') {
    const values = st.values || [];
    const ok = item.steps.filter((s, i) => gradeProofStep(s, values[i]).status === 'right').length + (st.choice === item.conclusion.answer ? 1 : 0);
    return Math.round((ok / (item.steps.length + 1)) * 2) / 2;
  }
  return 0;
}

export function isSolved(item, st = {}) {
  return itemPoints(item, st) === 1;
}

// Note suisse indicative (1 à 6, au demi-point)
export const swissGrade = (points, total) => Math.round((1 + (5 * points) / total) * 2) / 2;
