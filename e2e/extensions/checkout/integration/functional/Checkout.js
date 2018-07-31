/// <reference types="Cypress" />

import els from '../../elements/de';
import { clearProductFromCart } from '../../helper/cart';
import{ logOutUser } from '../../helper/user';

describe('Native Checkout functional', () => {
  it('should check for wrong coupon', () => {
    cy.visit('');
    cy.get(els.liveShoppingWidgetWithExpectedProduct)
      .should('be.visible')
      .click();
    cy.get(els.addToCartButton)
      .should('be.visible')
      .click();
    cy.get(els.cartButton)
      .click();
    cy.get(els.couponFieldInput)
      .should('be.visible')
      .type('10fixed{enter}')
    cy.get(els.basicDialogText)
      .contains('Gutschein wurde hinzugefügt')
      .should('be.visible');
    cy.get(els.basicDialogOkButton)
      .click();
    cy.get(els.deleteCouponButton)
      .should('be.visible')
      .click()
      .wait(3000);
    clearProductFromCart();
  });
});