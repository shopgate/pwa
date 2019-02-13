import els from '../elements/de';

/**
 * Helper function that clears the Cart
 */
export function clearProductsFromCart() {
  try {
    // Delete single product from cart
    cy.visit('cart');
    cy.get(els.contextMenu).each(($el) => {
      cy.window().spyAction('RECEIVE_CART', () => {
        cy.wrap($el).should('be.visible').click();
        cy.get(els.contextMenuButton)
          .contains('Entfernen')
          .click();
      });
    });

    // Check for empty cart
    cy.get(els.emptyCartPlaceHolderString)
      .scrollIntoView()
      .should('be.visible');
  } catch (err) {
    /* eslint-disable-next-line */
    console.log('cart seems to be empty');
  }
}
