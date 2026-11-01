import React, {useEffect, useRef, useState} from 'react';
import {Delete} from 'lucide-react';
import {previewLatex} from '../algebra.js';
import {Tex} from './Math.jsx';

// Touches utiles sur téléphone. « xⁿ » insère ^ : on tape ensuite l'exposant (x^5, x^10…).
const LETTERS = ['x', 'y', 'a', 'b', 'n'];
const SYMBOLS = [['²', '²'], ['³', '³'], ['xⁿ', '^'], ['(', '('], [')', ')'], ['+', '+'], ['−', '−'], ['·', '·'], ['/', '/']];

// Garde la case et sa barre de touches au-dessus du clavier du téléphone
function keepVisible(el) {
  if (!el) return;
  const vv = window.visualViewport;
  const r = el.getBoundingClientRect();
  const top = vv ? vv.offsetTop : 0;
  const height = vv ? vv.height : window.innerHeight;
  const margin = 12;
  if (r.bottom > top + height - margin) window.scrollBy({top: r.bottom - (top + height) + margin, behavior: 'instant'});
  else if (r.top < top + margin) window.scrollBy({top: r.top - top - margin, behavior: 'instant'});
}

export default function MathInput({value, onChange, onSubmit, disabled, unit, placeholder = 'Ta réponse', ariaLabel, letters, prefix}) {
  const ref = useRef(null);
  const box = useRef(null);
  const [focus, setFocus] = useState(false);
  const blurTimer = useRef(null);
  // La barre disparaît avec un léger délai : sinon le bouton « Vérifier » bouge sous le doigt pendant le clic.
  const onFocus = () => { clearTimeout(blurTimer.current); setFocus(true); };
  const onBlur = () => { clearTimeout(blurTimer.current); blurTimer.current = setTimeout(() => setFocus(false), 300); };
  useEffect(() => () => clearTimeout(blurTimer.current), []);

  // Quand le clavier s'ouvre ou que la saisie change, on remet la case et la barre en vue
  useEffect(() => {
    if (!focus) return;
    const fix = () => keepVisible(box.current);
    const t = setTimeout(fix, 350);
    const vv = window.visualViewport;
    vv && vv.addEventListener('resize', fix);
    return () => { clearTimeout(t); vv && vv.removeEventListener('resize', fix); };
  }, [focus]);
  useEffect(() => { if (focus) requestAnimationFrame(() => keepVisible(box.current)); }, [value, focus]);

  const letterKeys = letters ? LETTERS.filter(k => letters.includes(k)) : LETTERS;
  const preview = value && value.trim() ? previewLatex(value) : null;

  function insert(text) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length, end = el.selectionEnd ?? value.length;
    let next, caret;
    if (text === 'del') {
      const from = start === end ? Math.max(0, start - 1) : start;
      next = value.slice(0, from) + value.slice(end);
      caret = from;
    } else {
      next = value.slice(0, start) + text + value.slice(end);
      caret = start + text.length;
    }
    onChange(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(caret, caret); });
  }

  const reading = value && value.trim()
    ? <div className={`reading${preview ? '' : ' unreadable'}`} aria-live="polite">
        {preview ? <><span className="reading-label">Lecture :</span> <Tex tex={preview}/></> : <span>Écriture incomplète…</span>}
      </div>
    : null;
  const key = (label, text, extra = {}) => (
    <button key={label} type="button" tabIndex={-1} {...extra} onPointerDown={e => { e.preventDefault(); insert(text); }}>{label}</button>
  );

  return <div ref={box} className={`math-input${focus ? ' focused' : ''}`}>
    {/* Pendant la saisie, la lecture et les touches sont AU-DESSUS de la case : le clavier du téléphone ne les cache pas. */}
    {focus && !disabled && <div className="key-panel" onPointerDown={e => e.preventDefault()}>
      {reading || <div className="reading empty">Tape ta réponse : la lecture s’affiche ici.</div>}
      <div className="keybar">
        {letterKeys.map(k => key(k, k, {className: 'letter'}))}
        {SYMBOLS.map(([label, text]) => key(label, text, label === 'xⁿ' ? {className: 'pow', 'aria-label': 'Puissance'} : {}))}
        {key(<Delete size={18}/>, 'del', {className: 'del', 'aria-label': 'Effacer'})}
      </div>
    </div>}
    <div className="answer-row">
    {prefix && <span className="equals">{prefix}</span>}
    <div className="answer-line">
      <input
        ref={ref}
        type="text"
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onSubmit && onSubmit(); } }}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} inputMode="text" enterKeyHint="done"
      />
      {unit && <span className="unit">{unit}</span>}
    </div>
    </div>
    {!(focus && !disabled) && reading}
  </div>;
}
