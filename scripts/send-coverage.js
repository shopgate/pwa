#!/usr/bin/env node

const coveralls = require('@sourceallies/coveralls-merge');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const { packages } = require('../lerna.json');

const projectRoot = path.resolve(__dirname, '..');
const reports = [];

/**
 * Checks if a path is a directory.
 * @param {string} source The path to check.
 * @returns {boolean}
 */
const isDirectory = source => fs.lstatSync(source).isDirectory();

/**
 * Gets the sub directories of a directory.
 * @param {string} source The path to read out.
 * @returns {Array}
 */
const getDirectories = source => (
  fs.readdirSync(source).map(name => (
    path.join(source, name)
  )).filter(isDirectory)
);

logger.log('\n\n--- SEND COVERAGE ---\n\n');

// Grab the coverage files.
try {
  packages.forEach((pkg) => {
    const cleanPackage = pkg.split('/')[0];
    const packageRoot = path.resolve(projectRoot, cleanPackage);

    getDirectories(packageRoot).forEach((folder) => {
      const sub = (cleanPackage === 'extensions') ? 'frontend' : '';
      const reportFileAbsolute = path.resolve(folder, sub, 'coverage', 'lcov.info');
      const reportFile = `./${path.relative(projectRoot, reportFileAbsolute)}`;

      logger.info(`Checking coverage file in package: ${cleanPackage}`);

      if (fs.existsSync(reportFileAbsolute)) {
        reports.push({
          type: 'lcov',
          reportFile,
        });
      } else {
        logger.warn(`Coverage file not found: ${reportFileAbsolute}`);
      }
    });
  });
} catch (err) {
  throw err;
}

logger.log(reports);

try {
  if (!reports.length) {
    logger.error('No report files found!');
    return;
  }

  coveralls.sendReports(reports, {
    projectRoot,
  });
} catch (err) {
  logger.error(err);
}

logger.log('\n\n--- END: SEND COVERAGE ---\n\n');
