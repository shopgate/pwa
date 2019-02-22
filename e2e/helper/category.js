import els from '../elements/de';

/**
 * @param {string} selector selector
 */
export function navigateCategoryBySelector(selector) {
  cy.window().spyAction('ROUTE_DID_ENTER', () => {
    cy.get(selector)
      .scrollIntoView()
      .should('be.visible')
      .click();
  });

  cy.get(els.loadingIndicator).should('not.be.visible');
}
