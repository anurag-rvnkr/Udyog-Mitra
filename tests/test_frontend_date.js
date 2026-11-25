'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require('node:path').join(__dirname, '..', 'app.js'), 'utf8');
const definition = source.split(/\r?\n/).find(line => line.startsWith('function dateToday()'));
assert.ok(definition, 'dateToday must remain a pure local-date helper');

class FixedLocalDate extends Date {
  constructor(...args) { super(...(args.length ? args : ['2026-01-01T19:00:00.000Z'])); }
  getFullYear() { return 2026; }
  getMonth() { return 0; }
  getDate() { return 2; }
  toISOString() { return '2026-01-01T19:00:00.000Z'; }
}

const result = vm.runInNewContext(`${definition}; dateToday()`, { Date: FixedLocalDate });
assert.equal(result, '2026-01-02', 'follow-up boundaries must use the candidate local calendar date, not UTC');
process.stdout.write('local date boundary test passed\n');
