import els from '../../elements/de';
import { goLoginPage } from '../../helper/navigation';

describe('AndroidGMDTest login page', () => {
  before(goLoginPage);

  after(() => {
    // CloseBar
    cy.get(els.navigateButton).first().click();
  });

  it('should check for login email input', () => {
    cy.get(els.loginPageEmailInput)
      .should('be.visible');
    cy.get(els.loginPagePasswordInput)
      .should('be.visible');
    cy.get(els.forgotPasswordButton)
      .should('be.visible');
    cy.get(els.loginButton)
      .should('be.visible');
    cy.get(els.registerButton)
      .should('be.visible');
  });
});
