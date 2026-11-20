'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'script.user.js'), 'utf8');

function extract(name) {
  const start = source.indexOf('  function ' + name + '(');
  assert.ok(start >= 0, 'Missing function ' + name);
  const end = source.indexOf('\n  }\n', start);
  assert.ok(end > start, 'Could not extract ' + name);
  return source.slice(start, end + 5);
}

test('cosmetic guard requires an active mention and avoids genuine content overflow', () => {
  const context = vm.createContext({});
  vm.runInContext(extract('shouldGuardComposerHorizontalTrack'), context);
  const base = {
    mentionActive: true, widthExcess: 0, scrollbarWidget: false,
    containsInput: true, canScrollX: true, previouslyGuarded: false,
    originalOverflowX: 'scroll'
  };
  assert.equal(context.shouldGuardComposerHorizontalTrack(base), true);
  assert.equal(context.shouldGuardComposerHorizontalTrack({ ...base, mentionActive: false }), false);
  assert.equal(context.shouldGuardComposerHorizontalTrack({ ...base, widthExcess: 2 }), false);
  assert.equal(context.shouldGuardComposerHorizontalTrack({ ...base, originalOverflowX: 'auto' }), false);
  assert.equal(context.shouldGuardComposerHorizontalTrack({ ...base, containsInput: false }), false);
});

test('caret-relative mentions ignore inactive text and email addresses', () => {
  class FakeElement {}
  const context = vm.createContext({
    isElement: value => value instanceof FakeElement,
    document: {}
  });
  vm.runInContext(extract('mentionAtComposerCaret'), context);
  const input = new FakeElement();
  input.value = 'Ask @al about code';
  input.selectionStart = 7;
  assert.equal(context.mentionAtComposerCaret(input), true);
  input.selectionStart = input.value.length;
  assert.equal(context.mentionAtComposerCaret(input), false);
  input.value = 'write test@example.com';
  input.selectionStart = input.value.length;
  assert.equal(context.mentionAtComposerCaret(input), false);
  input.value = 'Hello @';
  input.selectionStart = input.value.length;
  assert.equal(context.mentionAtComposerCaret(input), true);
  input.value = 'Hello @one@two';
  input.selectionStart = input.value.length;
  assert.equal(context.mentionAtComposerCaret(input), false);
});
