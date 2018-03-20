#!/usr/bin/env node

const { argv } = require('yargs');
const fs = require('fs');
const uver = require('uver');
const logger = require('./logger');

const { file, v } = argv;

if (!file || file.length === 0) {
  logger.error('extension-config.json not bumped. No file specified!');
}

if (!v || v.length === 0) {
  logger.error('extension-config.js not bumped. No version specified!');
}

if (!fs.existsSync(file)) {
  logger.error(`extension-config.js not bumped. File not found: ${file}`);
}

try {
  uver({
    ver: v,
    filename: file,
  });

  logger.log(`${file} bumped to version: ${v}`);
} catch (error) {
  logger.error(error);
  process.exit(1);
}
