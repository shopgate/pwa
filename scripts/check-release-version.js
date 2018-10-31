#!/usr/bin/env node

const { argv } = require('yargs');
const logger = require('./logger');

const { v } = argv;

if (!v || v.length === 0) {
  logger.error('ERROR: No version specified!');
  process.exit(1);
} else {
  const regex = new RegExp(
    /^v{0,1}(0|[1-9]+[0-9]*)\.(0|[1-9]+[0-9]*)\.(0|[1-9]+[0-9]*)(-(alpha|beta|rc)\.[1-9]+[0-9]*){0,1}$/,
    'g'
  );
  if (!regex.test(v.replace('"', ''))) {
    logger.error('ERROR: An invalid version specified!');
    process.exit(1);
  }
  process.exit(0);
}
