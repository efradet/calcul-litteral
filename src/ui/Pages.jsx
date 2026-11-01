import React, {useEffect, useMemo, useState} from 'react';
import {ArrowLeft, RefreshCw, RotateCcw, ChevronRight, ChevronDown, Timer, ClipboardCheck, BookMarked, GraduationCap, BookOpenText} from 'lucide-react';
import {chapters, LEVELS, buildSeries, buildMaster, itemCount} from '../content/index.js';
import {Tex, MathText} from './Math.jsx';
import {Item} from './Items.jsx';
import Figure from './Figure.jsx';
import {isSolved, itemPoints, swissGrade} from './grading.js';

const seriesKey = (c, l) => `${c}.${l}`;

function Exercise({ex, states, setItemState, exam, revealed}) {
  return <section className="exercise">
    <header className="ex-head">
      <span className="ex-num">{ex.number}</span>
      <h3>{ex.title}</h3>
    </header>
    {ex.intro && <MathText text={ex.intro} as="p" className="ex-intro"/>}
    {ex.figure && <Figure figure={ex.figure}/>}
    <ol className="items">
      {ex.items.map(it => <Item key={it.id} item={it} state={states[it.id]} setState={s => setItemState(it.id, s)} exam={exam} revealed={revealed}/>)}
    </ol>
  </section>;
}

function Rappel({chapter, open, onToggle, go}) {
  return <aside className={`rappel${open ? ' open' : ''}`}>
    <button type="button" className="rappel-toggle" onClick={onToggle} aria-expanded={open}>
      <BookMarked size={17}/> Rappel {open ? <ChevronDown size={17}/> : <ChevronRight size={17}/>}
    </button>
    {open && <ul>{chapter.rappel.map((r, i) => <li key={i}>{r.tex && <Tex tex={r.tex}/>}<span>{r.text}</span></li>)}</ul>}
    {open && <button type="button" className="rappel-cours" onClick={() => go(`/cours/${chapter.id}`)}><BookOpenText size={16}/> Je ne comprends pas : lire le cours complet</button>}
  </aside>;
}

// ---------- Sommaire ----------
export function Home({store, go}) {
  const progressOf = (c, l) => {
    const s = store.series[seriesKey(c, l)];
    if (!s) return null;
    const ex = buildSeries(c, l, s.seed);
    const total = itemCount(ex);
    const done = ex.flatMap(e => e.items).filter(it => isSolved(it, s.answers?.[it.id])).length;
    return {done, total};
  };
  return <main className="page home">
    <header className="home-head">
      <p className="kicker">11VG · Préparation au test</p>
      <h1>Calcul littéral</h1>
      <p className="lead">Six chapitres, chacun avec un cours et trois niveaux d’exercices, puis un test blanc. Écris tes réponses comme dans ton cahier : l’appli vérifie, donne un indice si tu bloques, et montre le corrigé détaillé.</p>
    </header>
    <ol className="toc">
      {chapters.map(ch => <li key={ch.id} className={`toc-ch c${ch.id}`}>
        <div className="toc-title">
          <span className="ch-num">{ch.id}</span>
          <div><h2>{ch.title}</h2><p>{ch.subtitle}</p></div>
          <button type="button" className="cours-btn" onClick={() => go(`/cours/${ch.id}`)}><BookOpenText size={16}/> Cours</button>
        </div>
        <div className="toc-levels">
          {LEVELS.map(l => {
            const p = progressOf(ch.id, l.n);
            return <button key={l.n} type="button" className="level-btn" onClick={() => go(`/c/${ch.id}/${l.n}`)}>
              <strong>{l.name}</strong>
              <span>{p ? `${p.done} / ${p.total}` : l.sub}</span>
              {p && <i className="level-bar" style={{'--p': `${Math.round((p.done / p.total) * 100)}%`}}/>}
            </button>;
          })}
        </div>
      </li>)}
    </ol>
    <button type="button" className="master-card" onClick={() => go('/master')}>
      <GraduationCap size={30}/>
      <div><strong>Mode Master : test blanc</strong><span>Questions mélangées, plus difficiles que le niveau 3. Pas d’indice, correction et note indicative à la fin.</span></div>
      <ChevronRight size={22}/>
    </button>
    <button type="button" className="aide-link" onClick={() => go('/aide')}><BookMarked size={17}/> Aide-mémoire et conseils de saisie</button>
  </main>;
}

// ---------- Série d'un chapitre ----------
export function SeriesPage({chapterId, level, store, setStore, go}) {
  const ch = chapters.find(c => c.id === chapterId);
  const key = seriesKey(chapterId, level);
  const saved = store.series[key];
  const seed = saved?.seed;
  useEffect(() => {
    if (!seed) setStore(s => ({...s, series: {...s.series, [key]: {seed: Math.floor(Math.random() * 1e6) + 1, answers: {}}}}));
  }, [key, seed]);
  const exercises = useMemo(() => (seed ? buildSeries(chapterId, level, seed) : []), [chapterId, level, seed]);
  const [rappelOpen, setRappelOpen] = useState(level === 1);
  useEffect(() => setRappelOpen(level === 1), [chapterId, level]);
  if (!seed) return null;
  const answers = saved.answers || {};
  const setItemState = (id, st) => setStore(s => ({...s, series: {...s.series, [key]: {...s.series[key], answers: {...s.series[key].answers, [id]: st}}}}));
  const all = exercises.flatMap(e => e.items);
  const done = all.filter(it => isSolved(it, answers[it.id])).length;
  const renew = () => { setStore(s => ({...s, series: {...s.series, [key]: {seed: Math.floor(Math.random() * 1e6) + 1, answers: {}}}})); window.scrollTo({top: 0}); };
  const restart = () => { setStore(s => ({...s, series: {...s.series, [key]: {...s.series[key], answers: {}}}})); window.scrollTo({top: 0}); };
  const nextLevel = level < 3 ? `/c/${chapterId}/${level + 1}` : chapterId < 6 ? `/c/${chapterId + 1}/1` : '/master';
  return <main className={`page series c${chapterId}`}>
    <header className="page-head">
      <button type="button" className="back" onClick={() => go('/')}><ArrowLeft size={18}/> Sommaire</button>
      <p className="kicker">Chapitre {chapterId}</p>
      <div className="title-row"><h1>{ch.title}</h1><button type="button" className="cours-btn" onClick={() => go(`/cours/${chapterId}`)}><BookOpenText size={16}/> Cours</button></div>
      <nav className="level-tabs" aria-label="Niveaux">
        {LEVELS.map(l => <button key={l.n} type="button" className={l.n === level ? 'active' : ''} aria-current={l.n === level ? 'page' : undefined} onClick={() => go(`/c/${chapterId}/${l.n}`)}>{l.name}</button>)}
      </nav>
      <div className="progress-line"><span>{done} / {all.length} réussis</span><i style={{'--p': `${Math.round((done / all.length) * 100)}%`}}/></div>
    </header>
    <Rappel chapter={ch} open={rappelOpen} onToggle={() => setRappelOpen(o => !o)} go={go}/>
    {exercises.map(ex => <Exercise key={ex.number} ex={ex} states={answers} setItemState={setItemState}/>)}
    <footer className="series-foot">
      <button type="button" className="btn-secondary" onClick={renew}><RefreshCw size={17}/> Nouvelle série</button>
      <button type="button" className="btn-secondary" onClick={restart}><RotateCcw size={17}/> Effacer mes réponses</button>
      <button type="button" className="btn-primary" onClick={() => go(nextLevel)}>{level < 3 ? `Niveau ${level + 1}` : chapterId < 6 ? `Chapitre ${chapterId + 1}` : 'Mode Master'} <ChevronRight size={18}/></button>
    </footer>
  </main>;
}

// ---------- Mode Master ----------
function useClock(start, stopAt) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { if (stopAt) return; const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [stopAt]);
  const ms = Math.max(0, (stopAt || now) - start);
  const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function MasterPage({store, setStore, go}) {
  const m = store.master;
  useEffect(() => { if (!m) setStore(s => ({...s, master: {seed: Math.floor(Math.random() * 1e6) + 1, answers: {}, startedAt: Date.now(), submittedAt: null}})); }, [m]);
  const exercises = useMemo(() => (m ? buildMaster(m.seed) : []), [m?.seed]);
  const clock = useClock(m?.startedAt || Date.now(), m?.submittedAt);
  const [confirm, setConfirm] = useState(false);
  if (!m) return null;
  const revealed = !!m.submittedAt;
  const all = exercises.flatMap(e => e.items);
  const setItemState = (id, st) => setStore(s => ({...s, master: {...s.master, answers: {...s.master.answers, [id]: st}}}));
  const points = all.reduce((p, it) => p + itemPoints(it, m.answers[it.id]), 0);
  const answeredCount = all.filter(it => { const st = m.answers[it.id]; return st && (st.value?.trim() || st.choice !== undefined || st.values?.some(v => v && v.trim())); }).length;
  const submit = () => { setStore(s => ({...s, master: {...s.master, submittedAt: Date.now()}})); setConfirm(false); window.scrollTo({top: 0, behavior: 'smooth'}); };
  const fresh = () => { setStore(s => ({...s, master: {seed: Math.floor(Math.random() * 1e6) + 1, answers: {}, startedAt: Date.now(), submittedAt: null}})); window.scrollTo({top: 0}); };
  return <main className="page series master">
    <header className="page-head">
      <button type="button" className="back" onClick={() => go('/')}><ArrowLeft size={18}/> Sommaire</button>
      <p className="kicker">Mode Master</p>
      <h1>Test blanc</h1>
      <p className="lead">{revealed ? 'Le test est corrigé. Chaque question montre maintenant son corrigé.' : `Réponds à tout ce que tu peux, sans indice, comme pendant le test. Un brouillon papier est permis. Quand tu as fini, clique sur « Corriger le test ».`}</p>
      <div className="master-bar">
        <span><Timer size={16}/> {clock}</span>
        <span>{answeredCount} / {all.length} répondues</span>
      </div>
      {revealed && <div className="result-box">
        <p><strong>{String(points).replace('.', ',')} / {all.length} points</strong></p>
        <p>Note indicative : <strong>{String(swissGrade(points, all.length)).replace('.', ',')}</strong></p>
        <p className="small">Une réponse juste mais pas réduite ou pas complètement factorisée compte ½ point.</p>
      </div>}
    </header>
    {exercises.map(ex => <Exercise key={ex.number} ex={{...ex, title: `Question ${ex.number} · ${ex.title}`}} states={m.answers} setItemState={setItemState} exam revealed={revealed}/>)}
    <footer className="series-foot">
      {!revealed && !confirm && <button type="button" className="btn-primary" onClick={() => setConfirm(true)}><ClipboardCheck size={18}/> Corriger le test</button>}
      {!revealed && confirm && <div className="confirm">
        <p>{answeredCount < all.length ? `Il reste ${all.length - answeredCount} question(s) sans réponse. ` : ''}Corriger maintenant ? Tu ne pourras plus modifier tes réponses.</p>
        <button type="button" className="btn-secondary" onClick={() => setConfirm(false)}>Continuer le test</button>
        <button type="button" className="btn-primary" onClick={submit}>Oui, corriger</button>
      </div>}
      {revealed && <button type="button" className="btn-primary" onClick={fresh}><RefreshCw size={17}/> Nouveau test</button>}
    </footer>
  </main>;
}

// ---------- Aide-mémoire ----------
export function AidePage({go}) {
  const typing = [
    ['x au carré', 'x^2 ou x²', 'x^2'], ['3 fois x', '3x', '3x'], ['produit de deux parenthèses', '(x+2)(x-3)', '(x+2)(x-3)'],
    ['multiplication explicite', '3*4x ou 3·4x', '3*4x'], ['un demi de x', '1/2x', '1/2x'], ['nombre décimal', '0,5x ou 0.5x', '0,5x'], ['crochets', '2x - [3 - (x - 4)]', '2x - [3 - (x - 4)]']
  ];
  return <main className="page aide">
    <header className="page-head">
      <button type="button" className="back" onClick={() => go('/')}><ArrowLeft size={18}/> Sommaire</button>
      <p className="kicker">Fiche de révision</p>
      <h1>Aide-mémoire</h1>
    </header>
    <section className="exercise">
      <header className="ex-head"><span className="ex-num">✎</span><h3>Comment écrire les réponses</h3></header>
      <div className="table-scroll"><table className="typing">
        <thead><tr><th>Pour écrire…</th><th>Tape</th><th>Lecture</th></tr></thead>
        <tbody>{typing.map(([a, b, c]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td><td><MathText text={`{{${c}}}`}/></td></tr>)}</tbody>
      </table></div>
      <p className="ex-intro">Sur téléphone, une barre de touches (x, ², parenthèses…) apparaît sous la case de réponse. Sous ta réponse, la ligne « Lecture » montre comment l’appli a compris ce que tu as tapé : vérifie-la avant de valider.</p>
      <p className="ex-intro">« Développe et réduis » : la réponse ne doit plus contenir de parenthèses ni de termes semblables. « Factorise » : la réponse doit être un produit, et aucun facteur ne doit pouvoir encore se factoriser.</p>
    </section>
    {chapters.map(ch => <section key={ch.id} className={`exercise c${ch.id}`}>
      <header className="ex-head"><span className="ex-num">{ch.id}</span><h3>{ch.title}</h3></header>
      <ul className="rappel-list">{ch.rappel.map((r, i) => <li key={i}>{r.tex && <Tex tex={r.tex} display/>}<span>{r.text}</span></li>)}</ul>
    </section>)}
  </main>;
}
