import els from '../elements/de';

/**
 * Helper function that log out the user
 */
export function logOutUser() {
  cy.visit('');

  cy.get(els.navigatorButton)
    .should('be.visible')
    .click();
  cy.wait(3000);

  cy.get(els.loginWelcomeText).then(($loginWelcomeText) => {
    if ($loginWelcomeText.text().includes('Hallo Dennis')) {
      cy.get(els.logOutButton)
        .wait(2000)
        .scrollIntoView()
        .should('be.visible')
        .click();
      cy.get(els.basicDialogOkButton)
        .should('be.visible')
        .click();
    } else if ($loginWelcomeText.text().includes('Anmelden')) {
      cy.visit('');
      cy.wait(2000);
      console.log('No User logged in');
    }
  });
}

export function logInUser() {
  cy.visit('');

  cy.get(els.navigatorButton)
    .should('be.visible')
    .click();
  cy.wait(3000);

  cy.get(els.navigationDrawerLoginButton)
    .should('be.visible')
    .click();

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
    });
}
