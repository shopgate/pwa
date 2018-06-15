import els from '../elements/de';

/**
 * Helper function that clears the Cart
 */
export function clearProductFromCart() {
  try {
    // Delete single product from cart
    cy.visit('Cart');
    cy.get(els.contextMenu)
      .click();
    cy.get(els.contextMenuButton)
      .contains('Entfernen')
      .click();
    // Check for empty cart
    cy.get(els.emptyCartPlaceHolderString)
      .should('be.visible');
  } catch (err) {
    console.log('cart seems to be empty');
  }
}

/**
   * Delete coupon from cart
   */
export function deleteCoupon() {
  cy.get('#root > main > div:nth-child(12) > div > section > div > article > section > ul > div:nth-child(2) > div > li > ul > li > button')
    .click();
}
