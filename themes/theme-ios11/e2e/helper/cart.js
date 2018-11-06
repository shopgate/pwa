import els from '../elements/de';

/**
 * Helper function that clears the Cart
 */
export function clearProductFromCart() {
  // Delete single product from cart
  cy.visit('Cart');
  cy.get(els.contextMenu).each(() => {
    cy.get(els.contextMenu)
      .should('be.visible')
      .first()
      .click();
    cy.get(els.contextMenuButton)
      .contains('Entfernen')
      .click();
    cy.wait(500);
  });
}

