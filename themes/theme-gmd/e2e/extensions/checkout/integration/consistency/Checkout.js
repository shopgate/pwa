/// <reference types="Cypress" />

import els from '../../elements/de';
import { clearProductFromCart } from '../../helper/cart';
import{ logOutUser } from '../../helper/user';

describe('Native Checkout', () => {
  it('should check for correct title', () => {
    cy.visit('')
    cy.get(els.liveShoppingWidgetWithExpectedProduct)
      .should('be.visible')
      .click();
    cy.get(els.addToCartButton)
      .should('be.visible')
      .click();
    cy.get(els.cartButton)
      .should('be.visible')
      .click();
    cy.get(els.checkoutButton)
      .should('be.visible')
      .click();

    cy.get('@user').then((user) => {
      const userC = user;

      cy.get(els.loginPageEmailInput)
        .should('be.visible')
        .clear()
        .type(userC.username);
      cy.get(els.loginPagePasswordInput)
        .should('be.visible')
        .clear()
        .type(userC.password)
        .type('{enter}');
    });
    cy.get(els.expectedCheckoutTitle)
      .should('be.visible');
  });

  it('should check for correct checkout summary', () => {
    cy.get(els.checkoutSummary)
      .should('be.visible');
  });

  it('should check for shippingAdress title', () => {
    cy.get(els.shippingAdressTitle)
      .should('be.visible');
  });

  it('should check for add shippingAdress button', () => {
    cy.get(els.addShippingAdressButton)
      .should('be.visible');
  });

  it('should check for billingAdress titel', () => {
    cy.get(els.billingAdressTitle)
      .should('be.visible');
  });

  it('should check for add billingAdress button', () => {
    cy.get(els.addBillingAdressButton)
      .should('be.visible');
  });

  it('should check for shipping methods title', () => {
    cy.get(els.shippingMethodsTitle)
      .should('be.visible');
  });

  it('should check for shipping methods', () => {
    cy.get(els.DHLShippingMethod)
      .should('be.visible');
    cy.get(els.HermesShippingMethod)
      .should('be.visible');
    cy.get(els.UPSShippingMethod)
      .should('be.visible');
  });

  it('should chec for payment title', () => {
    cy.get(els.paymentTitle)
      .should('be.visible');
  });

  it('should check for payment methods', () => {
    cy.get(els.AuthorizeNetPaymentMethod)
      .should('be.visible');
    cy.get(els.CashOnDeliveryPaymentMethod)
      .scrollIntoView()
      .should('be.visible');
    cy.get(els.PaypalPaymentMethod)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for my cart title', () => {
    cy.get(els.myCartTitle)
      .should('be.visible');
  });

  it('should check for expected Cart Item', () => {
    cy.get(els.expectedCartitemProductWithBasePrice1)
      .should('be.visible');
    cy.get(els.expectedCartItemQuanitity)
      .should('be.visible');
    cy.get(els.expectedCartItemProductWithBasePrice1Price)
      .should('be.visible');
  });

  it('should check for correct expected cart total', () => {
    cy.get(els.totalsComponentSpan)
      .contains('10,00')
      .should('be.visible');
      clearProductFromCart();
      logOutUser();
  });
});
