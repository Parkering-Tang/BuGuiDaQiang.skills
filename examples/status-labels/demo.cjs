const assert = require('node:assert/strict');

// Fictional data. This deterministic example makes no model calls.
const records = [{ status: 'pending' }, { status: 'done' }, { status: 'paused' }];
const original = JSON.stringify(records);
const labels = { pending: '待处理', done: '已完成' };
const displayStatus = status => Object.hasOwn(labels, status) ? labels[status] : status;

assert.deepEqual(records.map(record => displayStatus(record.status)), ['待处理', '已完成', 'paused']);
assert.equal(JSON.stringify(records), original);

for (const record of records) console.log(`${record.status} → ${displayStatus(record.status)}`);
console.log('PASS: display mapping, unknown-state fallback, unchanged source data.');
