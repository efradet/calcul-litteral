// Texte avec des formules : "Un carré de côté {{x + 3}} cm" -> morceaux texte / LaTeX
import {latexOf} from './algebra.js';

export function segmentToLatex(seg) {
  return seg.split(/(=|→|≠)/).map(part => {
    if (part === '=') return ' = ';
    if (part === '→') return ' \\to ';
    if (part === '≠') return ' \\neq ';
    const t = part.trim();
    if (!t) return '';
    try { return latexOf(t); } catch { return t; }
  }).join('');
}

export function splitMath(text) {
  const out = [];
  const re = /\{\{(.+?)\}\}/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({type: 'text', value: text.slice(last, m.index)});
    out.push({type: 'math', value: segmentToLatex(m[1])});
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({type: 'text', value: text.slice(last)});
  return out;
}
