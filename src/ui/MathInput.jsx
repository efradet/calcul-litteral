import React, {useEffect, useRef, useState} from 'react';
import {Delete} from 'lucide-react';
import {previewLatex} from '../algebra.js';
import {Tex} from './Math.jsx';

// Touches utiles sur téléphone : lettres, exposants, parenthèses, signes
const KEYS = ['x', 'y', 'a', 'b', 'n', '²', '³', '(', ')', '+', '−', '·', '/'];

export default function MathInput({value, onChange, onSubmit, disabled, unit, placeholder = 'Ta réponse', ariaLabel, letters}) {
  const ref = useRef(null);
  const [focus, setFocus] = useState(false);
  const blurTimer = useRef(null);
  // La barre de touches disparaît avec un léger délai : sinon le bouton « Vérifier » bouge sous le doigt pendant le clic.
  const onFocus = () => { clearTimeout(blurTimer.current); setFocus(true); };
  const onBlur = () => { clearTimeout(blurTimer.current); blurTimer.current = setTimeout(() => setFocus(false), 300); };
  useEffect(() => () => clearTimeout(blurTimer.current), []);
  const keys = letters ? KEYS.filter(k => !/^[a-z]$/.test(k) || letters.includes(k)) : KEYS;
  const preview = value && value.trim() ? previewLatex(value) : null;

  function insert(text) {
    const el = ref.current;
    if (!el) return;
    if (text === 'del') {
      const start = el.selectionStart ?? value.length, end = el.selectionEnd ?? value.length;
      const from = start === end ? Math.max(0, start - 1) : start;
      const next = value.slice(0, from) + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => { el.focus(); el.setSelectionRange(from, from); });
      return;
    }
    const start = el.selectionStart ?? value.length, end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + text + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + text.length, start + text.length); });
  }

  return <div className={`math-input${focus ? ' focused' : ''}`}>
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
    {value && value.trim() && <div className={`reading${preview ? '' : ' unreadable'}`} aria-live="polite">
      {preview ? <><span className="reading-label">Lecture :</span> <Tex tex={preview}/></> : <span>Écriture incomplète…</span>}
    </div>}
    {focus && !disabled && <div className="keybar" onPointerDown={e => e.preventDefault()}>
      {keys.map(k => <button key={k} type="button" tabIndex={-1} onPointerDown={e => { e.preventDefault(); insert(k); }}>{k}</button>)}
      <button type="button" tabIndex={-1} className="del" aria-label="Effacer" onPointerDown={e => { e.preventDefault(); insert('del'); }}><Delete size={18}/></button>
    </div>}
  </div>;
}
