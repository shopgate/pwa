import { clearProductFromCart } from '../../helper/cart';
import els from '../../elements/de';

describe('IOS11Test CartPage', () => {
  it('it should check for empty cart', () => {
    cy.visit('');
    cy.get(els.tabBarCart)
      .click();
    cy.get(els.emptyCartPlaceHolderString)
      .should('be.visible');
  });

  it('should check for product in cart', () => {
    cy.visit('');
    cy.get(els.allProductCategory)
      .click();
    cy.get(els.loadingIndicator)
      .should('not.be.visible');
    cy.get(els.productWithManyProps4GridViewName)
      .last()
      .click();
    cy.get(els.addToCartBarButton)
      .click();
    cy.get(els.cartButton)
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
      .should('be.visible')
      .wait(3000);
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
