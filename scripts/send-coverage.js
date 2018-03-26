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

// Grab the coverage files.
try {
  packages.forEach((pkg) => {
    const cleanPackage = pkg.split('/')[0];
    const packageRoot = path.resolve(projectRoot, cleanPackage);

    getDirectories(packageRoot).forEach((folder) => {
      const sub = (cleanPackage === 'extensions') ? 'frontend' : '';
      const reportFileAbsolute = path.resolve(folder, sub, 'coverage', 'lcov.info');
      const reportFile = `./${path.relative(projectRoot, reportFileAbsolute)}`;

      if (fs.existsSync(reportFileAbsolute)) {
        reports.push({
          type: 'lcov',
          reportFile,
        });
      }
    });
  });
} catch (err) {
  throw err;
}

try {
  if (!reports.length) {
    throw new Error('No report files found!');
  }

  coveralls.sendReports(reports, {
    projectRoot,
  });
} catch (err) {
  throw err;
}

logger.log('Coverage reports sent!');
