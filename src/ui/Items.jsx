import React, {useState} from 'react';
import {Check, X, Lightbulb, BookOpen, CircleAlert, PencilLine} from 'lucide-react';
import {Tex, Expr, MathText} from './Math.jsx';
import MathInput from './MathInput.jsx';
import {gradeExpr, gradeProofStep} from './grading.js';
import {latexOf} from '../algebra.js';

const lettersIn = src => [...new Set(String(src).match(/[a-z]/g) || [])];

// Message sous la réponse
function Feedback({result, hint}) {
  if (!result) return null;
  const map = {
    right: ['right', <Check size={17}/>, 'Juste.'],
    form: ['form', <CircleAlert size={17}/>, result.message],
    wrong: ['wrong', <X size={17}/>, result.hint ? `Pas encore. ${result.hint}` : 'Pas encore : ce n’est pas égal à la bonne réponse.'],
    error: ['error', <CircleAlert size={17}/>, result.message],
    empty: ['error', <CircleAlert size={17}/>, 'Écris d’abord ta réponse.']
  };
  const [cls, icon, msg] = map[result.status] || map.error;
  return <p className={`feedback ${cls}`} role="status">{icon}<span>{msg}{result.status === 'wrong' && hint ? '' : ''}</span></p>;
}

// Corrigé : lignes de calcul alignées, comme à la fin d'un livre
export function Solution({item}) {
  const first = item.prompt ? latexOf(item.prompt) : item.promptTex || null;
  return <div className="solution">
    <p className="solution-title"><BookOpen size={15}/> Corrigé</p>
    <div className="solution-lines">
      {first && item.prompt && <div className="sline"><span className="eq"/><Tex tex={first}/></div>}
      {item.steps.map((s, i) => (
        <div className="sline" key={i}>
          {s.src && <><span className="eq">{i === 0 && !item.prompt ? '' : '='}</span><Tex tex={latexOf(s.src)}/></>}
          {s.tex && <><span className="eq"/><Tex tex={s.tex}/></>}
          {s.text && <MathText text={s.text} className="stext"/>}
          {s.note && <span className="snote">{s.note}</span>}
        </div>
      ))}
    </div>
    <p className="solution-answer">Réponse : <Expr src={item.answer}/>{item.unit ? ` ${item.unit}` : ''}</p>
  </div>;
}

function ToolRow({onCheck, onHint, onSolution, hintShown, solutionShown, canCheck, onDraft, draftShown}) {
  return <div className="tool-row">
    {onCheck && <button type="button" className="btn-check" onClick={onCheck} disabled={!canCheck}>Vérifier</button>}
    <button type="button" className={`btn-ghost${hintShown ? ' on' : ''}`} onClick={onHint}><Lightbulb size={16}/> Indice</button>
    <button type="button" className={`btn-ghost${solutionShown ? ' on' : ''}`} onClick={onSolution}><BookOpen size={16}/> Corrigé</button>
    {onDraft && <button type="button" className={`btn-ghost${draftShown ? ' on' : ''}`} onClick={onDraft}><PencilLine size={16}/> Brouillon</button>}
  </div>;
}

export function ExprItem({item, state, setState, exam, revealed}) {
  const st = state || {};
  const value = st.value || '';
  const result = exam ? (revealed ? gradeExpr(item, value) : null) : st.result;
  const solved = result && result.status === 'right';
  const update = patch => setState({...st, ...patch});
  const check = () => update({result: gradeExpr(item, value), tries: (st.tries || 0) + 1});
  const letters = lettersIn(`${item.answer} ${item.prompt || ''}`);
  return <li className={`item${solved ? ' solved' : ''}`} id={item.id}>
    <div className="item-head">
      {item.label && <span className="item-label">{item.label}</span>}
      <div className="item-body">
        {item.text && <MathText text={item.text} as="p" className="item-text"/>}
        {item.prompt && !item.text && <div className="prompt"><Tex tex={latexOf(item.prompt)} display/></div>}
        {item.prompt && item.text && <div className="prompt small"><Tex tex={latexOf(item.prompt)}/></div>}
        {item.promptTex && <div className="prompt"><Tex tex={item.promptTex} display/></div>}
      </div>
      <span className={`mark${result ? ` ${result.status}` : ''}`} aria-hidden="true">{solved ? <Check size={20}/> : result && result.status !== 'empty' && result.status !== 'error' ? (result.status === 'form' ? '~' : <X size={18}/>) : ''}</span>
    </div>
    <div className="answer-zone">
      <MathInput prefix={item.prompt && !item.text && !item.promptTex ? '=' : null} value={value} onChange={v => update({value: v, result: exam ? undefined : st.result && v === value ? st.result : undefined})} onSubmit={exam ? undefined : check} disabled={exam && revealed} unit={item.unit} letters={letters.length ? letters : undefined} ariaLabel={`Réponse ${item.label || ''}`}/>
    </div>
    {!exam && <ToolRow canCheck={!!value.trim()} onCheck={check} onHint={() => update({hint: !st.hint})} onSolution={() => update({solution: !st.solution})} hintShown={st.hint} solutionShown={st.solution} onDraft={() => update({draftOpen: !st.draftOpen})} draftShown={st.draftOpen}/>}
    {!exam && st.draftOpen && <textarea className="draft" rows={4} value={st.draft || ''} onChange={e => update({draft: e.target.value})} placeholder="Brouillon : écris tes étapes ici (rien n’est corrigé)." spellCheck={false}/>}
    <Feedback result={result}/>
    {!exam && st.hint && <p className="hint"><Lightbulb size={16}/><span>{item.hint}</span></p>}
    {(st.solution || (exam && revealed)) && <Solution item={item}/>}
  </li>;
}

export function ProofItem({item, state, setState, exam, revealed}) {
  const st = state || {};
  const values = st.values || [];
  const results = exam ? (revealed ? item.steps.map((s, i) => gradeProofStep(s, values[i])) : []) : st.results || [];
  const update = patch => setState({...st, ...patch});
  const setValue = (i, v) => { const vs = [...values]; vs[i] = v; const rs = [...(st.results || [])]; rs[i] = undefined; update({values: vs, results: rs}); };
  const checkStep = i => { const rs = [...(st.results || [])]; rs[i] = gradeProofStep(item.steps[i], values[i]); update({results: rs}); };
  const choiceResult = (exam ? revealed : st.choice !== undefined) && st.choice !== undefined ? (st.choice === item.conclusion.answer) : null;
  const allSteps = item.steps.every((s, i) => results[i] && results[i].status === 'right');
  const solved = allSteps && choiceResult === true;
  const letters = lettersIn(item.steps.map(s => s.answer).join(' '));
  return <li className={`item proof${solved ? ' solved' : ''}`} id={item.id}>
    <div className="item-head">
      {item.label && <span className="item-label">{item.label}</span>}
      <MathText text={item.text} as="p" className="item-text"/>
      <span className={`mark${solved ? ' right' : ''}`} aria-hidden="true">{solved ? <Check size={20}/> : ''}</span>
    </div>
    <ol className="proof-steps">
      {item.steps.map((s, i) => <li key={i}>
        <p className="step-label">{s.labelTex ? <><span>{s.label}</span> <Tex tex={s.labelTex}/></> : s.label}</p>
        <div className="step-row">
          <MathInput value={values[i] || ''} onChange={v => setValue(i, v)} onSubmit={exam ? undefined : () => checkStep(i)} disabled={exam && revealed} letters={letters.length ? letters : undefined} ariaLabel={s.label}/>
          {!exam && <button type="button" className="btn-check small" disabled={!(values[i] || '').trim()} onClick={() => checkStep(i)}>Vérifier</button>}
        </div>
        <Feedback result={results[i]}/>
      </li>)}
    </ol>
    <fieldset className="conclusion">
      <legend>{item.conclusion.question}</legend>
      {item.conclusion.options.map((o, i) => <label key={i} className={`choice-line${st.choice === i && choiceResult !== null ? (i === item.conclusion.answer ? ' good' : ' bad') : ''}`}>
        <input type="radio" name={`${item.id}-c`} checked={st.choice === i} disabled={exam && revealed} onChange={() => update({choice: i})}/>
        <span>{o}</span>
      </label>)}
    </fieldset>
    {!exam && <ToolRow onHint={() => update({hint: !st.hint})} onSolution={() => update({solution: !st.solution})} hintShown={st.hint} solutionShown={st.solution}/>}
    {!exam && st.hint && <p className="hint"><Lightbulb size={16}/><span>{item.hint}</span></p>}
    {(st.solution || (exam && revealed)) && <div className="solution">
      <p className="solution-title"><BookOpen size={15}/> Rédaction modèle</p>
      {item.redaction.map((l, i) => <MathText key={i} text={l.text} as="p" className="redaction"/>)}
      <ol className="proof-answers">{item.steps.map((s, i) => <li key={i}>{s.label} <Expr src={s.answer}/></li>)}</ol>
    </div>}
  </li>;
}

export function ChoiceItem({item, state, setState, exam, revealed}) {
  const st = state || {};
  const answered = st.choice !== undefined && (!exam || revealed);
  const good = answered && st.choice === item.answer;
  return <li className={`item${good ? ' solved' : ''}`} id={item.id}>
    <div className="item-head">
      {item.label && <span className="item-label">{item.label}</span>}
      <MathText text={item.text} as="p" className="item-text"/>
      <span className={`mark${answered ? (good ? ' right' : ' wrong') : ''}`} aria-hidden="true">{answered ? (good ? <Check size={20}/> : <X size={18}/>) : ''}</span>
    </div>
    <div className="tf-row">
      {item.options.map((o, i) => <button key={o} type="button" disabled={exam && revealed} className={`tf${st.choice === i ? ' picked' : ''}${answered && st.choice === i ? (good ? ' good' : ' bad') : ''}`} onClick={() => setState({...st, choice: i})}>{o}</button>)}
    </div>
    {answered && <p className={`feedback ${good ? 'right' : 'wrong'}`}>{good ? <Check size={17}/> : <X size={17}/>}<MathText text={item.explain}/></p>}
  </li>;
}

export function Item(props) {
  const k = props.item.kind;
  if (k === 'proof') return <ProofItem {...props}/>;
  if (k === 'choice') return <ChoiceItem {...props}/>;
  return <ExprItem {...props}/>;
}
