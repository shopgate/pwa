// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import els from '../../elements/de';
import { clearProductFromCart } from '../../helper/cart';
import { logOutUser, logInUser } from '../../helper/user';

describe('Native Checkout functional', () => {
  it('should check for user not logged in', () => {
    logOutUser();
  });

  it('should check for coupon', () => {
    logInUser();
    cy.wait(2000);
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
      .type('10fixed{enter}');
    cy.get(els.basicDialogText)
      .contains('Gutschein wurde hinzugefügt')
      .should('be.visible');
    cy.get(els.basicDialogOkButton)
      .click();
    cy.get(els.checkoutButton)
      .should('be.visible')
      .click()
      .wait(2000);
    cy.get(els.totalsComponentSpan)
      .contains('-10')
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for DHL Shipping', () => {
    cy.get(els.DHLShippingMethod)
      .scrollIntoView()
      .click();
    cy.get(els.shippingTotalLabel)
      .scrollIntoView()
      .should('be.visible');
    cy.get(els.shippingTotalAmountDHL)
      .should('be.visible');
  });

  it('should check for paypal Payment', () => {
    cy.get(els.PaypalPaymentMethod)
      .click();
    cy.get(els.paymentTotalLabel)
      .should('be.visible');
    cy.get(els.paymenttotalAmountPaypal)
      .should('be.visible');
  });

  it('should check for add shpping adress button', () => {
    cy.get(els.addShippingAdressButton)
      .scrollIntoView()
      .click();
    cy.get(els.adressFormFirstName)
      .should('be.visible')
      .type('Mr');
    cy.get(els.adressFormLastName)
      .type('Example');
    cy.get(els.adressFormStreet)
      .type('teststreet 1');
    cy.get(els.adressFormCity)
      .type('Butzbach');
    cy.get(els.adressFromCountry)
      .select(els.adressFormCountryDEOption);
    cy.get(els.adressFormZip)
      .type('35510');
    cy.go('back');
  });

  it('should check for add billing adress button', () => {
    cy.get(els.addBillingAdressButton)
      .scrollIntoView()
      .click();
    cy.get(els.adressFormFirstName)
      .should('be.visible')
      .type('Mr');
    cy.get(els.adressFormLastName)
      .type('Example');
    cy.get(els.adressFormStreet)
      .type('teststreet 1');
    cy.get(els.adressFormCity)
      .type('Butzbach');
    cy.get(els.adressFromCountry)
      .select(els.adressFormCountryDEOption);
    cy.get(els.adressFormZip)
      .type('35510');
    cy.go('back');
  });

  it('should delete coupon and products from cart', () => {
    cy.visit('/cart');
    cy.get(els.deleteCouponButton)
      .should('be.visible')
      .click();
    cy.get(els.deleteCouponButton)
      .should('not.be.visible');
    clearProductFromCart();
  });

  it('should logout user', () => {
    logOutUser();
  });
});
