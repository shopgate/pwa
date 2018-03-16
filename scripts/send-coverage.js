#!/usr/bin/env node

const coveralls = require('@sourceallies/coveralls-merge');
const fs = require('fs');
const path = require('path');
const lernaJson = require('../lerna.json');

const reports = [];

/**
 * Adds a new report file.
 * @param {string} packageName The package name.
 * @param {string} [sub=''] A sub directory.
 */
function addReport(packageName, sub = '') {
  const reportFile = path.join(__dirname, '..', packageName, sub, 'coverage', 'lcov.info');

  if (fs.existsSync(reportFile)) {
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

lernaJson.packages.forEach((pkg) => {
  const cleanPackage = pkg.split('/')[0];
  const pkgPath = path.join(__dirname, '..', cleanPackage);
  getDirectories(pkgPath).forEach((folder) => {
    const cleanedFolder = folder.replace(path.join(__dirname, '..'), '');
    const sub = (cleanPackage === 'extensions') ? 'frontend' : '';

    addReport(cleanedFolder, sub);
  });
});

try {
  if (reports.length) {
    coveralls.sendReports(reports);
    console.log('Coverage reports sent!');
  }
} catch (err) {
  console.error(err);
}
