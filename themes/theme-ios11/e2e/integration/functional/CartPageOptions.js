import els from '../../elements/de';
import { clearProductFromCart } from '../../helper/cart';

describe('functional tests cart page', () => {
  it('should check for product with options', () => {
    cy.visit('');

    cy.get(els.productWithOptionsCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.simpleProductWithOptionsNameProductGrid)
      .should('be.visible')
      .click();
    cy.get(els.addToCartBarButton)
      .should('be.visible')
      .click();
    cy.get(els.cartButton)
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

  it('should check for delete product from cart', () => {
    clearProductFromCart();
  });
});
