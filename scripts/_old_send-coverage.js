#!/usr/bin/env node

const coveralls = require('@sourceallies/coveralls-merge');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const lernaJson = require('../lerna.json');

const reports = [];

/**
 * Adds a new report file.
 * @param {string} packageName The package name.
 * @param {string} [sub=''] A sub directory.
 */
function addReport(packageName, sub = '') {
  const reportFile = `.${path.join(packageName, sub, 'coverage', 'lcov.info')}`;

  console.log(path.join('..', reportFile));

  if (fs.existsSync(path.join('..', reportFile))) {
    reports.push({
      type: 'lcov',
      reportFile,
    });
  }
}

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

try {
  lernaJson.packages.forEach((pkg) => {
    const cleanPackage = pkg.split('/')[0];
    const pkgPath = path.join(__dirname, '..', cleanPackage);

    getDirectories(pkgPath).forEach((folder) => {
      const cleanedFolder = folder.replace(path.join(__dirname, '..'), '');
      const sub = (cleanPackage === 'extensions') ? 'frontend' : '';

      addReport(cleanedFolder, sub);
    });

    console.log(reports);
  });
} catch (err) {
  throw err;
}

try {
  if (reports.length) {
    coveralls.sendReports(reports);
    logger.log('Coverage reports sent!');
  }
} catch (err) {
  throw err;
}
