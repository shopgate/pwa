// eslint-disable-next-line import/named
import { navigatorButton, backButton, navigationDrawerBackdrop } from '../elements/de';

/**
 * Open the navDrawer
 */
export function openNavDrawer() {
  cy.reload();
  cy.get(navigatorButton)
    .should('be.visible')
    .click();
}

/**
 * Close the navDrawer
 */
export function closeNavDrawer() {
  cy.get(navigationDrawerBackdrop).click({ force: true });
}

/**
 * Go Back navigation
 */
export function goBack() {
  cy.window().spyAction('ROUTE_DID_ENTER', () => {
    cy.get(backButton).last().should('be.visible').click();
  });
}

