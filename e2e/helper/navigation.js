import { navigatorButton, backButton, navigationDrawerBackdrop } from '../elements/de';

/**
 * Open the navDrawer
 */
export function openNavDrawer() {
  cy.reload();
  cy.window().spyAction('TOGGLE_NAV_DRAWER', () => {
    cy.get(navigatorButton)
      .should('be.visible')
      .click();
  });
}

/**
 * Close the navDrawer
 */
export function closeNavDrawer() {
  cy.window().spyAction('TOGGLE_NAV_DRAWER', () => {
    cy.get(navigationDrawerBackdrop).click({ force: true });
  });
}

/**
 * Go Back navigation
 */
export function goBack() {
  cy.window().spyAction('UPDATE_HISTORY', () => {
    cy.get(backButton).should('be.visible').click();
  });
}

