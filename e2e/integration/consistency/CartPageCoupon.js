import { clearProductFromCart } from '../../helper/cart';
import els from '../../elements/de';

describe('IOS11Test CartPageCoupon', () => {
  it('should check for product in cart', () => {
    cy.visit('');
    cy.get(els.allProductCategory)
      .click();
    cy.get(els.loadingIndicator)
      .should('not.be.visible');
    cy.get(els.productWithManyProps4GridViewName)
      .last()
      .click();
    cy.get(els.addToCartBarButton)
      .click();
    cy.get(els.cartButton)
      .click();
    cy.get(els.cartItem)
      .contains('Product with many Properties - 4 -')
      .should('be.visible');
  });

  it('should check for couponField', () => {
    cy.get(els.couponFieldInput)
      .should('be.visible');
  });

  it('should check for submit coupon button', () => {
    cy.get(els.couponFieldInput)
      .type('test');
    cy.get(els.couponSubmitButton)
      .should('be.visible');
  });

  it('should clear Cart', () => {
    clearProductFromCart();
  });
});

