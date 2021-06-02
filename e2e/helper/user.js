import els from '../elements/de';
import { goMorePage } from './navigation'

/**
 * Helper function that log out the user
 */
export function logOutUser() {
  goMorePage();

  cy.get(els.loginWelcomeText).then(($loginWelcomeText) => {
    if ($loginWelcomeText.text().includes('Hallo Dennis')) {
      cy.get(els.logOutButtonMoreMenu)
        .wait(2000)
        .scrollIntoView()
        .should('be.visible')
        .click();
      cy.get(els.basicDialogOkButton)
        .should('be.visible')
        .click();
    } else if ($loginWelcomeText.text().includes('Anmelden')) {
      cy.log('User is not logged');
    }
  });
}

/**
 * Helper function that log in the user
 */
export function logInUser() {
  goMorePage();

  cy.get(els.loginWelcomeText)
    .then((loginWelcomeText) => {
      const needLogin = loginWelcomeText.text().includes('Anmelden');

      cy.log(`Use need login: ${JSON.stringify(needLogin)}`);
      if (!needLogin) {
        return;
      }

      cy.window().spyAction('ROUTE_DID_ENTER', () => {
        loginWelcomeText.click();
      });

      cy.fixture('userCredentials').then((credentials) => {
        cy.window().spyAction('RECEIVE_USER', () => {
          cy.get(els.loginPageEmailInput)
            .should('be.visible')
            .clear()
            .type(credentials.username);

          cy.get(els.loginPagePasswordInput)
            .should('be.visible')
            .clear()
            .type(credentials.password)
            .type('{enter}');
        });
      });
    });
}
