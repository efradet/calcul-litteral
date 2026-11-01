import React, {useState} from 'react';
import {ArrowLeft, ChevronRight, TriangleAlert, Lightbulb, ListOrdered, PencilLine} from 'lucide-react';
import {chapters} from '../content/index.js';
import {cours} from '../content/cours.js';
import {Tex, MathText} from './Math.jsx';
import {ExprItem, Solution} from './Items.jsx';
import {latexOf} from '../algebra.js';

function WorkedExample({ex}) {
  return <div className="worked">
    <p className="worked-title">{ex.title}</p>
    <div className="solution-lines">
      <div className="sline"><span className="eq"/><Tex tex={latexOf(ex.prompt)}/></div>
      {ex.steps.map((s, i) => <div className="sline" key={i}>
        {s.src && <><span className="eq">=</span><Tex tex={latexOf(s.src)}/></>}
        {s.text && <MathText text={s.text} className="stext"/>}
        {s.note && <span className="snote">{s.note}</span>}
      </div>)}
    </div>
  </div>;
}

function Block({b, tryState, setTryState}) {
  if (b.h) return <h2 className="cours-h">{b.h}</h2>;
  if (b.p) return <MathText text={b.p} as="p" className="cours-p"/>;
  if (b.f !== undefined) return <div className="formula"><Tex tex={b.f} display/>{b.c && <p>{b.c}</p>}</div>;
  if (b.ex) return <WorkedExample ex={b.ex}/>;
  if (b.method) return <div className="method"><p className="box-title"><ListOrdered size={17}/> {b.method.title}</p><ol>{b.method.list.map((l, i) => <li key={i}><MathText text={l}/></li>)}</ol></div>;
  if (b.warn) return <div className="warn"><p className="box-title"><TriangleAlert size={17}/> Erreurs fréquentes</p><ul>{b.warn.map((w, i) => <li key={i}><MathText text={w}/></li>)}</ul></div>;
  if (b.tip) return <div className="tip"><p className="box-title"><Lightbulb size={17}/> Astuce</p><MathText text={b.tip} as="p"/></div>;
  if (b.table) return <div className="table-scroll"><table className="cours-table"><thead><tr>{b.table.head.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{b.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><MathText text={c}/></td>)}</tr>)}</tbody></table></div>;
  if (b.try) {
    const item = {kind: 'expr', id: 'cours-try', label: '', ...b.try};
    return <div className="try">
      <p className="box-title"><PencilLine size={17}/> {b.try.text}</p>
      <ol className="items"><ExprItem item={{...item, text: undefined}} state={tryState} setState={setTryState}/></ol>
    </div>;
  }
  return null;
}

export default function CoursePage({chapterId, go}) {
  const ch = chapters.find(c => c.id === chapterId);
  const [tryState, setTryState] = useState({});
  return <main className={`page cours c${chapterId}`}>
    <header className="page-head">
      <button type="button" className="back" onClick={() => go('/')}><ArrowLeft size={18}/> Sommaire</button>
      <p className="kicker">Cours · Chapitre {chapterId}</p>
      <h1>{ch.title}</h1>
      <p className="lead">{ch.subtitle}. Lis le cours tranquillement, refais les exemples sur ton brouillon, puis essaie l’exercice « À toi » en bas de page.</p>
    </header>
    <article className="cours-body">
      {cours[chapterId].map((b, i) => <Block key={i} b={b} tryState={tryState} setTryState={setTryState}/>)}
    </article>
    <footer className="series-foot">
      {chapterId > 1 && <button type="button" className="btn-secondary" onClick={() => go(`/cours/${chapterId - 1}`)}><ArrowLeft size={17}/> Cours {chapterId - 1}</button>}
      <button type="button" className="btn-primary" onClick={() => go(`/c/${chapterId}/1`)}>S’entraîner : niveau 1 <ChevronRight size={18}/></button>
    </footer>
  </main>;
}

export {Solution};
