'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'script.user.js'), 'utf8');

function extract(name) {
  const beginning = source.indexOf('  function ' + name + '(');
  assert.ok(beginning >= 0, 'Missing function ' + name);
  const ending = source.indexOf('\n  }\n', beginning);
  assert.ok(ending > beginning, 'Could not extract ' + name);
  return source.slice(beginning, ending + 5);
}

test('userscript candidate metadata and runtime versions agree', () => {
  const meta = source.match(/^\/\/ @version\s+([^\n]+)/m);
  const runtime = source.match(/const VERSION = '([^']+)'/);
  assert.ok(meta && runtime);
  assert.equal(meta[1], runtime[1]);
  assert.equal(meta[1], '2026.10.30.1');
  assert.match(source, /petrt3522/);
});

test('no new network, remote loading, or dynamic execution primitives', () => {
  for (const pattern of [
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
    /\bGM_xmlhttpRequest\b/,
    /\bWebSocket\b/,
    /\bsendBeacon\b/,
    /\beval\s*\(/,
    /\bnew\s+Function\s*\(/,
    /\bimport\s*\(/,
    /^\/\/ @(?:require|connect|updateURL|downloadURL)\b/m
  ]) {
    assert.doesNotMatch(source, pattern);
  }
});

test('performance scoring distinguishes tiny overruns from severe overruns', () => {
  const context = vm.createContext({ PERFORMANCE_SCORE_EXCESS_SCALE_MS: 16 });
  vm.runInContext(extract('performanceScoreFromExcess'), context);
  assert.equal(context.performanceScoreFromExcess(0, 0), 100);
  assert.ok(context.performanceScoreFromExcess(0.1, 1) >= 99);
  assert.ok(context.performanceScoreFromExcess(0.1, 1) >
    context.performanceScoreFromExcess(18, 1));
  assert.equal(context.performanceScoreFromExcess(16, 1), 0);
});

test('manual self-test samples cannot alter background performance score', () => {
  const runtime = { performanceBudgetState: new Map([
    ['watchdog', {
      name: 'watchdog', budgetMs: 1, samples: 2,
      violations: 1, totalMs: 4, maxMs: 3, lastMs: 3,
      overBudgetMs: 2, lastAt: 10
    }],
    ['selfTest', {
      name: 'selfTest', budgetMs: 20, samples: 1,
      violations: 1, totalMs: 900, maxMs: 900, lastMs: 900,
      overBudgetMs: 880, lastAt: 20
    }]
  ]) };
  const context = vm.createContext({
    runtime,
    PERFORMANCE_BUDGET: Object.freeze({
      watchdog: 1, reconcile: 2, fullScan: 8, selfTest: 20
    }),
    PERFORMANCE_SCORE_EXCESS_SCALE_MS: 16
  });
  vm.runInContext(extract('performanceScoreFromExcess'), context);
  vm.runInContext(extract('getPerformanceBudgetReport'), context);
  const report = context.getPerformanceBudgetReport();
  assert.equal(report.totalSamples, 2);
  assert.equal(report.totalViolations, 1);
  assert.equal(report.totalOverBudgetMs, 2);
  assert.equal(report.operations.selfTest.samples, 1);
  assert.equal(report.score, 94);
});

function makeStyle(current) {
  let value = current;
  return {
    getPropertyValue() { return value; },
    getPropertyPriority() { return ''; },
    setProperty(_key, next) { value = next; },
    removeProperty() { value = ''; }
  };
}

test('clipping cleanup restores owned translation but preserves external overrides', () => {
  for (const external of [false, true]) {
    const style = makeStyle(external ? '80px 0px' : '20px 0px');
    const runtime = {
      clipThreadNode: { style },
      clipThreadPrevious: '2px 0px',
      clipThreadPreviousPriority: '',
      clipThreadApplied: '20px 0px',
      clipThreadShift: 20
    };
    const context = vm.createContext({ runtime, markMutationIntent() {} });
    vm.runInContext(extract('clearClipThreadAlignment'), context);
    context.clearClipThreadAlignment();
    assert.equal(style.getPropertyValue('translate'),
      external ? '80px 0px' : '2px 0px');
    assert.equal(runtime.clipThreadNode, null);
  }
});
