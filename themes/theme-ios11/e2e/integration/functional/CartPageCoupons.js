import els from '../../elements/de';
import { clearProductsFromCart } from '../../helper/cart';
import { goBrowsePage } from '../../helper/navigation'
import { navigateCategoryBySelector } from '../../helper/category';

describe('functional tests cart page', () => {
  before(goBrowsePage);

  after(() => {
    cy.go('back');
    cy.go('back');
    clearProductsFromCart();
  });

  it('should add second product to cart and delete it', () => {
    navigateCategoryBySelector(els.basicCategory);
    navigateCategoryBySelector(els.productsWithLongNamesCat);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithVeryLongName5Name)
        .last()
        .click();
    });

    cy.spyAction('RECEIVE_CART', () => cy.get(els.addToCartBarButton).click());
    cy.spyAction('ROUTE_DID_ENTER', () => cy.get(els.cartButton).click());
  });

  it('should check for wrong coupon', () => {
    cy.get(els.couponFieldInput)
      .type('wrongCoupon {enter}');
    cy.get(els.basicDialogText)
      .contains('Der Gutscheincode ist ungültig!');
    cy.get(els.basicDialogOkButton)
      .click();
  });

  it('should check for right coupon', () => {
    cy.get(els.couponFieldInput)
      .clear()
      .type('test1');
    cy.get(els.couponSubmitButton)
      .click();
    cy.get(els.basicDialogOkButton)
      .click();
    cy.get(els.cart.subTotal).should('be.visible').contains('89,00');
    cy.get(els.cart.discount).should('be.visible').contains('-5,00');
    cy.get(els.cart.grandTotal).should('be.visible').contains('84,00');
  });

  it('should delete coupon from cart', () => {
    cy.get(els.deleteCouponButton)
      .click();
    cy.get(els.deleteCouponButton)
      .should('not.exist');
  });
});
