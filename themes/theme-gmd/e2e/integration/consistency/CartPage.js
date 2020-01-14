import { clearProductsFromCart } from '../../helper/cart';
import els from '../../elements/de';
import { goCartPage, goHomePage } from '../../helper/navigation';

describe('AndroidGMDTest CartPage', () => {
  after(clearProductsFromCart);

  it('it should check for empty cart', () => {
    goCartPage();
    cy.get(els.emptyCartPlaceHolderString).should('be.visible');
  });

  it('it should check for product in cart', () => {
    goHomePage();
    cy.get(els.allProductCategory)
      .click();
    cy.get(els.loadingIndicator)
      .should('not.be.visible');
    cy.get(els.productWithManyProps4GridViewName)
      .last()
      .click();

    cy.spyAction('RECEIVE_CART', () => cy.get(els.addToCartButton).click())
      .then(() => (
        cy.spyAction('ROUTE_DID_ENTER', () => cy.get(els.cartButton).last().click())
      ));

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
      .should('be.visible')
      .contains('199');
  });

  it('should check for shipping label', () => {
    cy.get(els.shippingLabel)
      .contains('Versand')
      .should('be.visible');
  });

  it('should check for TaxDisclaimer', () => {
    cy.get(els.taxDisclaimerFooter)
      .last()
      .contains('* Inkl. MwSt. evtl. zzgl. Versandkosten')
      .should('be.visible');
  });
});
