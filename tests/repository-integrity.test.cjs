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
const icon = 'https://chatgpt.com/unauth-mweb/images/favicon-48x48.png';
const readmeIcon = 'https://chatgpt.com/unauth-mweb/images/chatgpt-icon-512x512.png';

test('userscript, runtime, README and changelog agree', () => {
  assert.match(version || '', /^\d{4}\.\d{2}\.\d{2}\.\d+$/);
  assert.ok(script.includes("const VERSION = '" + version + "';"));
  assert.ok(script.includes('  Version: ' + version));
  assert.ok(readme.includes('GitHub-' + version));
  assert.match(readme, /\]\(\.\/CHANGELOG\.md\)/);
  assert.ok(changelog.includes('## [' + version + ']'));
});

test('userscript retains the native favicon and README uses the high-resolution app icon', () => {
  assert.equal(script.match(/^\/\/ @icon\s+(\S+)$/m)?.[1], icon);
  assert.ok(readme.includes('src="' + readmeIcon + '"'));
  assert.ok(!readme.includes('src="' + icon + '"'));
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
