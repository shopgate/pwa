/* eslint-disable global-require */
// ***********************************************************
// This example support/index.js is processed and
// Loaded automatically before your test files.
//
// This is a great place to put global configuration and
// Behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// Automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

beforeEach(() => {
  cy.fixture('userCredentials.json').as('user');
});

Cypress.Cookies.defaults({
  whitelist: 'SGCONNECT',
});

Cypress.on('uncaught:exception', () => false);

if (process.env.COVERAGE_REPORT) {
  const istanbul = require('istanbul-lib-coverage');
  const map = istanbul.createCoverageMap({});

  Cypress.on('window:before:unload', (e) => {
    const coverage = e.currentTarget.__coverage__; // eslint-disable-line no-underscore-dangle

    if (coverage) {
      map.merge(coverage);
    }
  });

  after(() => {
    cy.window().then((win) => {
      const coverage = win.__coverage__; // eslint-disable-line no-underscore-dangle

      if (coverage) {
        map.merge(coverage);
      }

      cy.writeFile('.nyc_output/out.json', JSON.stringify(map));
      cy.exec('nyc report --temp-directory e2e/.nyc_output --reporter=html --reporter=lcov');
    });
  });
}

/* eslint-enable global-require */
