'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const script = read('script.user.js');
const readme = read('README.md');
const changelog = read('CHANGELOG.md');
const version = script.match(/^\/\/ @version\s+(\S+)$/m)?.[1];
const icon = 'assets/ultrawide-icon.png';

test('userscript, runtime, README, changelog and release notes agree', () => {
  assert.match(version || '', /^\d{4}\.\d{2}\.\d{2}\.\d+$/);
  assert.ok(script.includes("const VERSION = '" + version + "';"));
  assert.ok(script.includes('  Version: ' + version));
  assert.ok(readme.includes('GitHub-' + version));
  assert.ok(readme.includes('RELEASE_NOTES_' + version + '.md'));
  assert.ok(changelog.includes('## [' + version + ']'));
  assert.ok(fs.existsSync(path.join(root, 'RELEASE_NOTES_' + version + '.md')));
});

test('icon metadata resolves to a square PNG tracked in this repository', () => {
  assert.ok(script.includes('// @icon         https://raw.githubusercontent.com/jsmlabs/ultrawide-chatgpt/master/' + icon));
  const file = path.join(root, icon);
  assert.ok(fs.existsSync(file), 'Missing userscript icon');
  const buffer = fs.readFileSync(file);
  assert.ok(buffer.length > 24);
  assert.deepEqual([...buffer.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  assert.ok(width >= 16 && width <= 4096);
  assert.equal(width, height, 'Icon should be square');
});

test('GitHub installation does not auto-update to a separate Greasy Fork build', () => {
  assert.doesNotMatch(script, /^\/\/ @(updateURL|downloadURL|require|connect)\b/m);
  assert.match(script, /^\/\/ @match\s+https:\/\/chatgpt\.com\/\*/m);
  assert.match(script, /element\.contains\?\.\(focused\)/);
  assert.match(script, /element\.matches\(PRIMARY_COMPOSER_INPUT\)\) score \+= 800/);
});

test('README relative links point to existing tracked paths', () => {
  const links = [...readme.matchAll(/\]\(\.\/([^#)]+)(?:#[^)]+)?\)/g)];
  assert.ok(links.length > 8);
  for (const [, resource] of links) {
    const target = path.resolve(root, resource);
    assert.ok(target.startsWith(root + path.sep), 'Unsafe relative path: ' + resource);
    assert.ok(fs.existsSync(target), 'Broken README link: ' + resource);
  }
});
