#!/usr/bin/env node
/* eslint-disable no-console */

// eslint-disable-next-line max-len
// Example: githubJenkinsParser.js --payload='{"action": "opened", "pull_request": {"head": {"ref": "PWA-111"}}}'
const { argv } = require('yargs');

const prStatuses = [
  'opened',
  'reopened',
  'edited',
];

const { payload } = argv;

let parsed;
try {
  parsed = JSON.parse(payload);
} catch (e) {
  console.error(e);
  process.exit(1);
}

const { action, pull_request: { head: { ref = null } = {} } = {} } = parsed;

if (!prStatuses.includes(action)) {
  console.log('Pull request status ignored');
  process.exit(2);
}

if (!ref) {
  console.log('Pull request head reference is empty');
  process.exit(1);
}

console.log(ref);
/* eslint-enable no-console */
