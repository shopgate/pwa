import { clearProductFromCart } from '../../helper/cart';
import els from '../../elements/de';

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
      .click();
    cy.get(els.loadingIndicator)
      .should('not.be.visible');
    cy.get(els.productWithManyProps4GridViewName)
      .last()
      .click();
    cy.get(els.addToCartButton)
      .click();
    cy.get(els.cartButton)
      .last()
      .click();
    cy.get(els.cartItem)
      .contains('Product with many Properties - 4 -')
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
      .contains('Versand')
      .should('be.visible');
  });

  it('should check for TaxDisclaimer', () => {
    cy.get(els.taxDisclaimerFooter)
      .last()
      .contains('* Alle Preise inkl. MwSt. evtl. zzgl. Versand')
      .should('be.visible');
  });

  it('should clear Cart', () => {
    clearProductFromCart();
  });
});
