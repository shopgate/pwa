#!/usr/bin/env node

const coveralls = require('@sourceallies/coveralls-merge');
const fs = require('fs');
const path = require('path');
const lernaJson = require('../lerna.json');

const reports = [];

/**
 * Adds a new report file.
 * @param {string} workspace The package workspace.
 * @param {string} packageName The package name.
 * @param {string} [sub=''] A sub directory.
 */
function addReport(workspace, packageName, sub = '') {
  const reportFile = path.join(workspace, packageName, sub, 'coverage', 'lcov.info');

  console.log(reportFile);
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
  const pkgPath = path.join(__dirname, '..', pkg.split('/')[0]);
  getDirectories(pkgPath).forEach(folder => console.log(folder));
});
