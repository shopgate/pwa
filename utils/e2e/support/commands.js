/* eslint-disable no-param-reassign, no-underscore-dangle */
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
 * Spy console log for PWA actions.
 * When action is logged, assign it as cypress resource
 * @example
 * cy.window().spyAction('TOGGLE_NAV_DRAWER', () => {
    cy.get(navigatorButton)
      .should('be.visible')
      .click()
  }).then(action => ... check action extra params ... )
 */
Cypress.Commands.add('spyAction', { prevSubject: 'window' }, (window, action, cyCode) => {
  // Begin to track actions
  const actions = new Map();
  // Set ta falsy by default
  actions.set(action, false);

  window.console._log = window.console.log;
  // Replace by spy function
  window.console.log = (...args) => {
    window.console._log(...args);
    if (args[2] && args[2].type && action === args[2].type) {
      actions.set(action, args[2]);
    }
  };

  // Run cy.* commands
  cyCode();

  // Catch and return actions
  return cy.wrap(actions)
    .invoke('get', action)
    .should('be.ok')
    .then((resultAction) => {
      // restore console log
      window.console.log = window.console._log;
      return resultAction;
    });
});

/* eslint-enable no-param-reassign, no-underscore-dangle */
