import React, {useMemo} from 'react';
import katex from 'katex';
import {splitMath} from '../mathtext.js';
import {latexOf} from '../algebra.js';

export function Tex({tex, display = false, className = ''}) {
  const html = useMemo(() => {
    try { return katex.renderToString(tex, {throwOnError: false, displayMode: display}); } catch { return tex; }
  }, [tex, display]);
  return <span className={`tex ${className}`} dangerouslySetInnerHTML={{__html: html}}/>;
}

// Expression écrite comme un élève la tape ("(2x+3)(x-4)") -> rendu mathématique
export function Expr({src, className}) {
  let tex;
  try { tex = latexOf(src); } catch { tex = src; }
  return <Tex tex={tex} className={className}/>;
}

// Texte avec formules {{...}}
export function MathText({text, as: Tag = 'span', className}) {
  const parts = splitMath(text);
  return <Tag className={className}>{parts.map((p, i) => (p.type === 'math' ? <Tex key={i} tex={p.value}/> : <React.Fragment key={i}>{p.value}</React.Fragment>))}</Tag>;
}
