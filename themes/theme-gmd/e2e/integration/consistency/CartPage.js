// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import { clearProductFromCart } from '../../helper/cart';
import els from '../../elements/de';

// TODO: refactor when bugs solved

describe('AndroidGMDTest CartPage', () => {
  it('it should check for empty cart', () => {
    cy.visit('');
    cy.get(els.navigatorButton)
      .click();
    cy.get(els.navDrawerCartButton)
      .click();
    cy.get(els.emptyCartPlaceHolderString)
      .should('be.visible');
  });

  it('it should check for product in cart', () => {
    cy.visit('');
    cy.get(els.allProductCategory)
      .first()
      .click();
    cy.get(els.productWithManyProps4GridViewName)
      .click();
    cy.get(els.addToCartButton)
      .click();
    cy.get(els.cartButton)
      .click();
    cy.get(els.productWithManyProps4CartItem)
      .should('be.visible');
  });

  it('should check for product pricing', () => {
    cy.get(els.productWithManyProps4CartitemPrice)
      .should('be.visible');
  });

  it('should check for correct sub total', () => {
    cy.get(els.productWithManyProps4CartSubTotal)
      .should('be.visible');
  });

  it('should check for shipping label', () => {
    cy.get(els.shippingLabel)
      .contains('zzgl. Versand')
      .should('be.visible');
  });

  it('should check for TaxDisclaimer', () => {
    cy.get(els.taxDisclaimerFooter)
      .contains('* Alle Preise inkl. MwSt. evtl. zzgl. Versand')
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
