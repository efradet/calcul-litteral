// Texte avec des formules : "Un carré de côté {{x + 3}} cm" -> morceaux texte / LaTeX.
// {{tex:...}} : LaTeX écrit à la main. **gras** dans le texte.
import {latexOf} from './algebra.js';

export function segmentToLatex(seg) {
  if (seg.startsWith('tex:')) return seg.slice(4);
  return seg.split(/(=|→|≠)/).map(part => {
    if (part === '=') return ' = ';
    if (part === '→') return ' \\to ';
    if (part === '≠') return ' \\neq ';
    const t = part.trim();
    if (!t) return '';
    if (/^[A-Z]$/.test(t)) return t; // A, B, C : noms d'expressions, gardés en majuscule
    try { return latexOf(t); } catch { return t; }
  }).join('');
}

export function splitMath(text) {
  const out = [];
  const re = /\{\{(.+?)\}\}(?!\})/g;
  let last = 0, m;
  const pushText = s => s.split(/(\*\*[^*]+\*\*)/).filter(Boolean).forEach(piece => {
    if (piece.startsWith('**') && piece.endsWith('**')) out.push({type: 'text', value: piece.slice(2, -2), bold: true});
    else out.push({type: 'text', value: piece});
  });
  while ((m = re.exec(text))) {
    if (m.index > last) pushText(text.slice(last, m.index));
    out.push({type: 'math', value: segmentToLatex(m[1])});
    last = m.index + m[0].length;
  }
  if (last < text.length) pushText(text.slice(last));
  return out;
}
