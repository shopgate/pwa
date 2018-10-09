// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import els from '../../elements/de';

describe('AndroidGMDTest login page', () => {
  it('should check for login email input', () => {
    cy.visit('');

    cy.get(els.navigatorButton)
      .click();
    cy.get(els.navigationDrawerLoginButton)
      .should('be.visible')
      .click();
    cy.get(els.loginPageEmailInput)
      .should('be.visible');
  });

  it('should check for login password input', () => {
    cy.get(els.loginPagePasswordInput)
      .should('be.visible');
  });

  it('should check for forgot password button', () => {
    cy.get(els.forgotPasswordButton)
      .should('be.visible');
  });

  it('should check for login button', () => {
    cy.get(els.loginButton)
      .should('be.visible');
  });

  it('should check for register button', () => {
    cy.get(els.registerButton)
      .should('be.visible');
  });
});
