import els from '../../elements/de';

import { clearProductsFromCart } from '../../helper/cart';

describe('functional test cart page options', () => {
  after(clearProductsFromCart);

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
      .last()
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
});
