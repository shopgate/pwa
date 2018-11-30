import els from '../../elements/de';

import { clearProductFromCart } from '../../helper/cart';

describe('functional test cart page options', () => {
  it('should check for product with options', () => {
    cy.visit('');

    cy.get(els.productWithOptionsCategory)
      .first()
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.loadingIndicator)
      .should('not.be.visible');
    cy.get(els.simpleProductWithOptionsNameProductGrid)
      .last()
      .should('be.visible')
      .click()
      .wait(1000);
    cy.get(els.addToCartButton)
      .should('be.visible')
      .click();
    cy.get(els.cartButtonProductPage)
      .should('be.visible')
      .click();
    cy.get(els.simpleProductWithOptionsCartItemLink)
      .should('be.visible');
    cy.get(els.cartItemLi)
      .contains('Green Ball')
      .should('be.visible');
    cy.get(els.cartItemLi)
      .contains('bright')
      .should('be.visible');
  });

  it('should clear cart', () => {
    clearProductFromCart();
  });
});
