import els from '../../elements/de';
import { clearProductsFromCart } from '../../helper/cart';
import { checkForWrongCoupon } from '../../helper/coupon';
import { goCategoriesPage } from '../../helper/navigation';
import { navigateCategoryBySelector } from '../../helper/category';

describe('functional tests CartPageCoupon', () => {
  before(goCategoriesPage);

  after(clearProductsFromCart);

  it('should add second product to cart', () => {
    navigateCategoryBySelector(els.catsBasicCategory);

    navigateCategoryBySelector(els.productsWithLongNamesCat);

    cy.get(els.productWithVeryLongName5Name)
      .last()
      .should('be.visible')
      .click();
    cy.get(els.addToCartButton)
      .click();
    cy.get(els.cartButtonProductPage)
      .last()
      .click();
  });

  it('should check for wrong coupon', () => {
    cy.spyAction('CREATE_MODAL', () => {
      cy.get(els.couponFieldInput)
        .type('wrongCoupon {enter}');
    });
    cy.spyAction('REMOVE_MODAL', () => {
      checkForWrongCoupon();
    });
  });

  it('should check for right coupon', () => {
    cy.get(els.couponFieldInput)
      .clear()
      .type('test1');

    cy.get(els.couponSubmitButton).click();
    cy.get(els.basicDialogOkButton).click();

    cy.get(els.cart.subTotal).should('be.visible').contains('89,00');
    cy.get(els.cart.discount).should('be.visible').contains('-5,00');
    cy.get(els.cart.grandTotal).should('be.visible').contains('84,00');
  });

  it('should delete coupon from cart', () => {
    cy.get(els.deleteCouponButton).click();
    cy.get(els.deleteCouponButton)
      .should('not.exist');
  });
});
