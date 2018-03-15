const { readFileSync, existsSync } = require('fs');
const { resolve } = require('path');
const { createTransformer } = require('babel-jest');
const { safeLoad } = require('js-yaml');
const stripComments = require('strip-json-comments');

const processBabelRCPath = resolve(process.cwd(), '.babelrc');
const relativeBabelRCPath = resolve('..', '..', '.babelrc');

let babelConfigString = '';

if (existsSync(processBabelRCPath)) {
  babelConfigString = readFileSync(processBabelRCPath, 'utf8');
} else if (existsSync(relativeBabelRCPath)) {
  babelConfigString = readFileSync(relativeBabelRCPath, 'utf8');
}

const babelConfig = safeLoad(stripComments(babelConfigString));

module.exports = createTransformer(babelConfig);
