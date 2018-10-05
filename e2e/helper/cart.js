import els from '../elements/de';

/**
 * Helper function that clears the Cart
 */
export function clearProductFromCart() {
  try {
    // Delete single product from cart
    cy.visit('Cart');
    cy.wait(500);
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
    // Check for empty cart
    cy.get(els.emptyCartPlaceHolderString)
      .should('be.visible');
  } catch (err) {
    console.log('cart seems to be empty');
  }
}
