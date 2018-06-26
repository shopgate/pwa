/// <reference types="Cypress" />

import els from '../../elements/de';

describe('functional tests login page', () => {
  it('should check for wrong credentials', () => {
    cy.visit('');
    cy.get(els.navigatorButton)
      .should('be.visible')
      .click();
    cy.get(els.navigationDrawerLoginButton)
      .should('be.visible')
      .click();
    cy.get(els.loginPageEmailInput)
      .should('be.visible')
      .type('test1@test2.de');
    cy.get(els.loginPagePasswordInput)
      .type('testest {enter}');
    cy.get(els.basicDialogText)
      .should('be.visible')
      .contains('The given credentials are wrong or do not exist.');
  });
});
