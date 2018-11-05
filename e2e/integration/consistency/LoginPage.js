import els from '../../elements/de';

describe('IOS11Test login page', () => {
  it('should check for user menu', () => {
    cy.visit('');

    cy.get(els.tabBarMore)
      .should('be.visible')
      .click();
    cy.get(els.userMenuLogin)
      .should('be.visible');
    cy.get(els.userMenuRegister)
      .should('be.visible');
  });

  it('should check for login email input', () => {
    cy.get(els.userMenuLogin)
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
