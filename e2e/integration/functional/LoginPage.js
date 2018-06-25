/// <reference types="Cypress" />

import els from '../../elements/de';

describe('functional tests login page', () => {
  it('should check for wrong credentials', () => {
    cy.visit('');
    cy.get(els.tabBarMore)
      .should('be.visible')
      .click();
    cy.get(els.userMenuLogin)
      .should('be.visible')
      .click();
    cy.get(els.loginPageEmailInput)
      .should('be.visible')
      .type('test1@test2.de');
    cy.get(els.loginPagePasswordInput)
      .type('testtest')
      .type('{enter}');
    cy.get(els.basicDialogText)
      .should('be.visible')
      .contains('The given credentials are wrong or do not exist.');
  });
});
