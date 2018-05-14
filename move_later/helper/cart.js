
export function clearCart() {
  //delete single product from cart
  cy.get('[data-test-id="ContextMenu"]', { timeout: 10000 }).click()
  cy.get('span').contains('Entfernen').click()

  //check for empty cart
  cy.wait(5000)
  cy.get('span').contains('Zur Kasse').should('not.be.visible')
  cy.get('span').contains('Ihr Warenkorb ist leer.', { timeout: 10000 }).should('be.visible')
}

export function deleteCoupon() {
  //delete coupon from cart
  cy.get('#root > main > div:nth-child(12) > div > section > div > article > section > ul > div:nth-child(2) > div > li > ul > li > button').click()
}
