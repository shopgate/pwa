import els from '../elements/de';

/**
 * Helper function that log out the user
 */
export function logOutUser() {
  cy.visit('');
  cy.reload();

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
