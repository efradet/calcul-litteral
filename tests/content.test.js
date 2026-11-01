// Vérifie tout le contenu sur de nombreuses séries tirées au hasard :
// réponses justes et dans la bonne forme, corrigés exacts ligne par ligne, formules affichables.
import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {chapters, buildSeries, buildMaster} from '../src/content/index.js';
import {checkAnswer, polyOf, peq, latexOf} from '../src/algebra.js';
import {splitMath} from '../src/mathtext.js';

const SEEDS = Array.from({length: 40}, (_, i) => i + 1);
const tex = t => katex.renderToString(t, {throwOnError: true});
const renderText = t => splitMath(t).filter(s => s.type === 'math').forEach(s => tex(s.value));
const where = (it, extra = '') => `${it.id} ${it.prompt || it.promptTex || it.text || ''} ${extra}`;

function checkExprItem(it) {
  // la réponse attendue est acceptée par sa propre vérification
  const self = checkAnswer(it.answer, it.answer, it.check);
  assert.equal(self.status, 'right', where(it, `réponse ${it.answer} -> ${JSON.stringify(self)}`));
  // l'énoncé (ou l'expression de départ) est égal à la réponse
  const ref = it.from || (it.prompt && !it.promptTex ? it.prompt : null);
  if (ref && it.check !== 'number') assert.ok(peq(polyOf(ref), polyOf(it.answer)), where(it, `départ ${ref} ≠ ${it.answer}`));
  if (ref && it.check === 'number') assert.ok(peq(polyOf(ref), polyOf(it.answer)), where(it, `calcul ${ref} ≠ ${it.answer}`));
  // l'énoncé lui-même n'est pas déjà une bonne réponse (sinon l'exercice est vide)
  if (it.prompt && (it.check === 'expanded' || it.check === 'factored') && !it.text) {
    assert.notEqual(checkAnswer(it.prompt, it.answer, it.check).status, 'right', where(it, 'énoncé déjà résolu'));
  }
  // chaque ligne du corrigé est égale à l'expression de départ
  const base = ref || it.answer;
  for (const s of it.steps || []) {
    if (s.src) {
      assert.ok(peq(polyOf(s.src), polyOf(base)), where(it, `étape ${s.src} ≠ ${base}`));
      tex(latexOf(s.src));
    }
    if (s.tex) tex(s.tex);
    if (s.text) renderText(s.text);
  }
  assert.ok((it.steps || []).length >= 1, where(it, 'pas de corrigé'));
  assert.ok(it.hint, where(it, 'pas d’indice'));
  if (it.prompt) tex(latexOf(it.prompt));
  if (it.promptTex) tex(it.promptTex);
  if (it.text) renderText(it.text);
}

function checkProofItem(it) {
  renderText(it.text);
  for (const st of it.steps) {
    const self = checkAnswer(st.answer, st.answer, st.check);
    assert.equal(self.status, 'right', where(it, `${st.label} ${st.answer} -> ${JSON.stringify(self)}`));
    if (st.from) assert.ok(peq(polyOf(st.from), polyOf(st.answer)), where(it, `${st.label}: ${st.from} ≠ ${st.answer}`));
    if (st.labelTex) tex(st.labelTex);
  }
  assert.ok(it.conclusion.answer >= 0 && it.conclusion.answer < it.conclusion.options.length);
  it.redaction.forEach(l => renderText(l.text));
}

function checkSeries(exercises) {
  for (const ex of exercises) {
    if (ex.intro) renderText(ex.intro);
    assert.ok(ex.items.length > 0);
    for (const it of ex.items) {
      if (it.kind === 'expr') checkExprItem(it);
      else if (it.kind === 'proof') checkProofItem(it);
      else if (it.kind === 'choice') { renderText(it.text); assert.ok(it.answer >= 0 && it.answer < it.options.length); }
      else assert.fail('type inconnu ' + it.kind);
    }
  }
}

for (const ch of chapters) {
  test(`chapitre ${ch.id} (${ch.title}) : 3 niveaux justes sur ${SEEDS.length} séries`, () => {
    ch.rappel.forEach(r => r.tex && tex(r.tex));
    for (const level of [1, 2, 3]) for (const seed of SEEDS) checkSeries(buildSeries(ch.id, level, seed));
  });
}

test(`mode Master juste sur ${SEEDS.length} séries`, () => {
  for (const seed of SEEDS) checkSeries(buildMaster(seed));
});

test('les séries changent avec la graine et restent identiques pour une même graine', () => {
  const a = JSON.stringify(buildSeries(1, 2, 3)), b = JSON.stringify(buildSeries(1, 2, 3)), c = JSON.stringify(buildSeries(1, 2, 4));
  assert.equal(a, b);
  assert.notEqual(a, c);
});
