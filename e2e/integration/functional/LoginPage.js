// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import els from '../../elements/de';
import { logOutUser } from '../../helper/user';

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
      .contains('Nutzername oder Passwort sind nicht korrekt');
    cy.get(els.basicDialogOkButton)
      .click();
  });

  it('should check for correct credentials', () => {
    cy.get('@user').then((user) => {
      const userC = user;

      cy.get(els.loginPageEmailInput)
        .should('be.visible')
        .clear()
        .type(userC.username);
      cy.get(els.loginPagePasswordInput)
        .should('be.visible')
        .clear()
        .type(userC.password)
        .type('{enter}');
      cy.wait(10000);
      cy.get(els.navigatorButton)
        .should('be.visible')
        .click();
      cy.get(els.loginWelcomeText)
        .should('be.visible')
        .contains('Hallo Dennis');
    });
    logOutUser();
  });

  it('should check for forgott password', () => {
    cy.get(els.navigatorButton)
      .should('be.visible')
      .click();
    cy.get(els.navigationDrawerLoginButton)
      .should('be.visible')
      .click();
    cy.get(els.forgotPasswordButton)
      .should('be.visible')
      .click();
    cy.get(els.basicDialogText)
      .should('be.visible')
      .contains('Bitte benutzen Sie die Desktop-Website, um Ihr Passwort zurückzusetzen.');
  });
});
