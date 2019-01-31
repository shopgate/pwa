import els from '../../elements/de';
import { clearProductFromCart } from '../../helper/cart';

describe('functional tests cart page', () => {
  it('should add sescond product to cart and delete it', () => {
    cy.visit('');
    cy.get(els.basicCategory)
      .last()
      .scrollIntoView()
      .click();
    cy.get(els.productsWithLongNamesCat)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.loadingIndicator)
      .should('not.be.visible');
    cy.get(els.productWithVeryLongName5Name)
      .last()
      .click();
    cy.get(els.addToCartBarButton)
      .click();
    cy.get(els.cartButton)
      .click();
  });

  it('should check for wrong coupon', () => {
    cy.get(els.couponFieldInput)
      .type('wrongCoupon {enter}');
    cy.get(els.basicDialogText)
      .contains('Coupon code "wrongCoupon" is not valid.');
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
    cy.get('[data-test-id="subTotal: 84"]')
      .should('be.visible');
  });

  it('should delete coupon from cart', () => {
    cy.get(els.deleteCouponButton)
      .click();
    cy.get(els.deleteCouponButton)
      .should('not.exist');
  });

  it('should check for delete product from cart', () => {
    clearProductFromCart();
  });
});
