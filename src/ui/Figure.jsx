import React from 'react';
import {Tex} from './Math.jsx';
import {segmentToLatex} from '../mathtext.js';

// Figures géométriques avec côtés exprimés en lettres. Repère : 100 × 60.
const L = (x, y, text, align = 'center') => ({x, y, text, align});

function geometry(f) {
  switch (f.type) {
    case 'rect': return {shapes: [{d: 'M20 10 H80 V50 H20 Z', fill: true}], labels: [L(50, 4, f.top), L(83, 30, f.right, 'left'), ...(f.center ? [L(50, 30, f.center)] : [])]};
    case 'square': return {shapes: [{d: 'M30 8 H70 V48 H30 Z', fill: true}], labels: [L(50, 2.5, f.side), L(73, 28, f.side, 'left')]};
    case 'triangle': return {shapes: [{d: 'M18 52 L82 52 L50 8 Z', fill: true}], labels: [L(31, 28, f.sides[0], 'right'), L(69, 28, f.sides[1], 'left'), L(50, 57, f.sides[2])]};
    case 'squareMinusSquare': return {
      shapes: [{d: 'M30 6 H72 V48 H30 Z', fill: true}, {d: 'M30 22 H56 V48 H30 Z', white: true}],
      labels: [L(51, 1.5, f.outer), L(75, 27, f.outer, 'left'), L(43, 19, f.inner), L(58, 35, f.inner, 'left')]
    };
    case 'lshape': return {
      shapes: [{d: 'M20 8 H62 V22 H80 V52 H20 Z', fill: true}, {d: 'M62 8 H80 V22', dashed: true}],
      labels: [L(50, 57, f.W), L(16, 30, f.H, 'right'), L(71, 25.5, f.cut[0]), L(60, 15, f.cut[1], 'right')]
    };
    case 'frame': return {
      shapes: [{d: 'M12 6 H88 V54 H12 Z', fill: true}, {d: 'M22 14 H78 V46 H22 Z', white: true}],
      labels: [L(50, 18.5, f.innerW), L(75, 30, f.innerH, 'right'), L(17, 30, f.width), L(50, 31, 'jardin', 'center', true)]
    };
    case 'trapezoid': return {
      shapes: [{d: 'M12 52 H88 L68 12 H32 Z', fill: true}, {d: 'M32 12 V52', dashed: true}],
      labels: [L(50, 6, f.top), L(50, 57.5, f.bottom), L(35, 33, f.h, 'left')]
    };
    default: return {shapes: [], labels: []};
  }
}

export default function Figure({figure}) {
  const {shapes, labels} = geometry(figure);
  return <figure className="figure" aria-label="Figure">
    <div className="figure-box">
      <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {shapes.map((s, i) => <path key={i} d={s.d} className={s.white ? 'shape-white' : s.dashed ? 'shape-dashed' : 'shape-fill'}/>)}
      </svg>
      {labels.filter(l => l.text).map((l, i) => (
        <span key={i} className={`fig-label ${l.align}`} style={{left: `${l.x}%`, top: `${(l.y / 60) * 100}%`}}>
          {l.text === 'jardin' ? <em>jardin</em> : l.text === '?' ? <strong>?</strong> : <Tex tex={segmentToLatex(l.text)}/>}
        </span>
      ))}
    </div>
    {figure.unit && <figcaption>Longueurs en {figure.unit}</figcaption>}
  </figure>;
}
