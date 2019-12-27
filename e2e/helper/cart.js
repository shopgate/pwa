import els from '../elements/de';
import { goCartPage } from './navigation';

/**
 * Helper function that clears the Cart
 */
export function clearProductsFromCart() {
  goCartPage();

  cy.get(els.contextMenu).each(($el) => {
    cy.spyAction('RECEIVE_CART', () => {
      cy.wrap($el).scrollIntoView().click();
      cy.get(els.contextMenuButton)
        .first()
        .contains('Entfernen')
        .click();
    });
  });
}
