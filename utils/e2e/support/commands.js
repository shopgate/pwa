// ***********************************************
// This example commands.js shows you how to
// Create various custom commands and overwrite
// Existing commands.
//
// For more comprehensive examples of custom
// Commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 * @typedef {Object} commands
 * @property {Function} spyAction
 *
 */

// noinspection BadExpressionStatementJS
/** @type {Cypress.cy & commands} */
// eslint-disable-next-line no-unused-expressions
cy;

/**
 * Spy for PWA actions.
 * @example
 * cy.spyAction('TOGGLE_NAV_DRAWER').then(action => {
 *    cy.get(navigatorButton)
 *     .should('be.visible')
 *     .click();
 *
 *     ... check action extra params ...
 * })
 */
Cypress.Commands.add('spyAction', (actionType, cyCode) => (
  cy.wrap(new Promise((resolve) => {
    cy.window().then((window) => {
      window.main$
        .filter(({ action }) => action.type === actionType)
        .first()
        .subscribe(resolve);

      if (cyCode) {
        cyCode();
      }
    });
  }))
));
