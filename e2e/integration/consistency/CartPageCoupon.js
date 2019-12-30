import els from '../../elements/de';
import { goBrowsePage } from '../../helper/navigation'
import { clearProductsFromCart } from '../../helper/cart'
import { navigateCategoryBySelector } from '../../helper/category'

describe('IOS11Test CartPageCoupon', () => {
  before(goBrowsePage);

  after(() => {
    cy.go('back');
    cy.go('back');
    clearProductsFromCart();
  });

  it('should check for product in cart', () => {
    navigateCategoryBySelector(els.allProductCategory);

    cy.get(els.productWithManyProps4GridViewName)
      .last()
      .click();

    cy.spyAction('RECEIVE_CART', () => cy.get(els.addToCartBarButton).click());

    cy.get(els.cartButton).click();
    cy.get(els.cartItem)
      .contains('Product with many Properties - 4 -')
      .should('be.visible');
  });

  it('should check for couponField', () => {
    cy.get(els.couponFieldInput)
      .should('be.visible')
      .type('test');

    cy.get(els.couponSubmitButton)
      .should('be.visible');
  });
});

