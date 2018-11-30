import els from '../elements/de';

/**
 * Helper function that log out the user
 */
export function logOutUser() {
  cy.visit('');

  cy.get(els.tabBarMore)
    .should('be.visible')
    .click();

  cy.wait(3000);

  cy.window()
    .its('store')
    .invoke('getState')
    .its('user')
    .its('login')
    .its('isLoggedIn')
    .then(($value) => {
      try {
        /* eslint-disable-next-line */
        expect($value).to.be.true;

        cy.get(els.logOutButtonMoreMenu)
          .should('be.visible')
          .click();
        cy.get(els.basicDialogOkButton)
          .should('be.visible')
          .click();
      } catch (err) {
        console.log(`isLoggedIn returned ${$value}`);
      }
    });
}
