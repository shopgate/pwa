import els from '../elements/de'

/**
 * Helper function that clears the Cart
 */
export function clearProductFromCart() {
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
}

export function deleteCoupon() {
  //delete coupon from cart
  cy.get('#root > main > div:nth-child(12) > div > section > div > article > section > ul > div:nth-child(2) > div > li > ul > li > button').click()
}
