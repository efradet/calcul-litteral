import test from 'node:test';
import assert from 'node:assert/strict';
import {checkAnswer, polyOf, polyToSource, parse} from '../src/algebra.js';

const st = (i, e, t) => checkAnswer(i, e, t).status;

test('lecture des écritures habituelles', () => {
  assert.equal(polyToSource(polyOf('2x²−3x·4')), '2x^2 - 12x');
  assert.equal(polyToSource(polyOf('(2x+3)(x−4)')), '2x^2 - 5x - 12');
  assert.equal(polyToSource(polyOf('3(x+1)')), '3x + 3');
  assert.equal(polyToSource(polyOf('0,5x + 1/2x')), 'x');
  assert.equal(polyToSource(polyOf('[2x-(3-x)]')), '3x - 3');
  assert.throws(() => parse('(x+1'));
  assert.throws(() => parse('x+'));
  assert.throws(() => parse('x = 2'));
});

test('développé et réduit', () => {
  assert.equal(st('2x^2-5x-12', '(2x+3)(x-4)', 'expanded'), 'right');
  assert.equal(st('-5x+2x^2-12', '(2x+3)(x-4)', 'expanded'), 'right');
  assert.equal(st('2x^2-8x+3x-12', '(2x+3)(x-4)', 'expanded'), 'form');
  assert.equal(st('(2x+3)(x-4)', '(2x+3)(x-4)', 'expanded'), 'form');
  assert.equal(st('2x^2-5x+12', '(2x+3)(x-4)', 'expanded'), 'wrong');
  assert.equal(st('x*x', 'x^2', 'expanded'), 'form');
});

test('factorisé complètement', () => {
  assert.equal(st('3(2x+3)', '6x+9', 'factored'), 'right');
  assert.equal(st('(2x+3)*3', '6x+9', 'factored'), 'right');
  assert.equal(st('6x+9', '6x+9', 'factored'), 'form');
  assert.equal(st('x(4x+6)', '4x^2+6x', 'factored'), 'form');
  assert.equal(st('2(x^2-9)', '2x^2-18', 'factored'), 'form');
  assert.equal(st('2(x-3)(x+3)', '2x^2-18', 'factored'), 'right');
  assert.equal(st('(x+3)(x-3)*2', '2x^2-18', 'factored'), 'right');
  assert.equal(st('(x-2)(x+2)(x^2+4)', 'x^4-16', 'factored'), 'right');
  assert.equal(st('(x^2-4)(x^2+4)', 'x^4-16', 'factored'), 'form');
  assert.equal(st('(x+2)(x+3)', 'x^2+5x+6', 'factored'), 'right');
  assert.equal(st('(x+1)(x+6)', 'x^2+5x+6', 'factored'), 'wrong');
});

test('multiple de k et nombres', () => {
  assert.equal(st('3(n+1)', '3n+3', 'multiple:3'), 'right');
  assert.equal(st('3n+3', '3n+3', 'multiple:3'), 'form');
  assert.equal(st('56 m²', '56', 'number'), 'right');
  assert.equal(st('56,0', '56', 'number'), 'right');
  assert.equal(st('x', '56', 'number'), 'wrong');
});

test('aide au diagnostic', () => {
  assert.match(checkAnswer('2x^2+5x+12', '(2x+3)(x-4)', 'expanded').hint, /signes/);
  assert.equal(st('', 'x', 'expanded'), 'empty');
  assert.equal(st('2x+', 'x', 'expanded'), 'error');
});

test('puissances : n’importe quel exposant entier', () => {
  assert.equal(polyToSource(polyOf('x^10 - 3x^7 + x^4')), 'x^10 - 3x^7 + x^4');
  assert.equal(polyToSource(polyOf('x^(12)')), 'x^12');
  assert.equal(polyToSource(polyOf('x^5*x^6')), 'x^11');
  assert.equal(polyToSource(polyOf('2^10')), '1024');
  assert.equal(st('x^9', 'x^4*x^5', 'expanded'), 'right');
  assert.equal(st('x^4*x^5', 'x^9', 'expanded'), 'form');
  assert.throws(() => parse('x^'), /exposant/);
  assert.throws(() => parse('x^99'), /maximum/);
});
