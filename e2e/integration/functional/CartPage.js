/// <reference types="Cypress" />

import els from '../../elements/de';
import { clearProductFromCart } from '../../helper/cart';

describe('functional tests cart page', () => {
  it('check for increase / decrease quanitity', () => {
    cy.visit('');

    cy.get(els.allProductCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.productWithManyProps4GridViewName)
      .should('be.visible')
      .click();
    cy.get(els.addToCartButton)
      .should('be.visible')
      .click();
    cy.get(els.cartButton)
      .should('be.visible')
      .click();
    cy.get(els.quantityPicker)
      .should('be.visible')
      .click()
      .type(2)
      .wait(100)
      .focus()
      .blur();
    cy.get('[data-test-id="minPrice: 0 price: 398 currency: EUR"]')
      .should('be.visible');
    cy.get(els.quantityPicker)
      .clear()
      .type(1)
      .wait(100)
      .focus()
      .blur();
    cy.get('[data-test-id="minPrice: 0 price: 199 currency: EUR"]')
      .should('be.visible');
  });

  it('should add sescond product to cart and delete it', () => {
    cy.visit('');
    cy.get(els.basicCategory)
      .scrollIntoView()
      .click();
    cy.get(els.productsWithLongNamesCat)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.productWithVeryLongName5Name)
      .last()
      .should('be.visible')
      .click();
    cy.get(els.addToCartButton)
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
    cy.get('[data-test-id="subTotal: 283"]')
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
