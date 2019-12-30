import { clearProductsFromCart } from '../../helper/cart';
import els from '../../elements/de';
import { goCartPage, goBrowsePage } from '../../helper/navigation';
import { navigateCategoryBySelector } from '../../helper/category';

describe('IOS11Test CartPage', () => {
  before(goCartPage);

  after(clearProductsFromCart);

  it('it should check for empty cart', () => {
    cy.get(els.emptyCartPlaceHolderString).should('be.visible');
  });

  it('should check for product in cart', () => {
    goBrowsePage();

    navigateCategoryBySelector(els.allProductCategory);

    cy.get(els.productWithManyProps4GridViewName)
      .last()
      .click();

    cy.spyAction('RECEIVE_CART', () => cy.get(els.addToCartBarButton).click());
    cy.spyAction('ROUTE_DID_ENTER', () => cy.get(els.cartButton).click());

    cy.get(els.cartItem)
      .contains('Product with many Properties - 4 -')
      .should('be.visible');
  });

  it('should check for product pricing', () => {
    cy.get(els.productWithManyProps4CartitemPrice)
      .should('be.visible');
  });

  it('should check for correct sub total', () => {
    cy.get(els.cart.subTotal).should('be.visible').contains('199,00');
    cy.get(els.cart.shipping).should('be.visible').contains('Kostenlos');
  });

  it('should check for TaxDisclaimer', () => {
    cy.get(els.taxDisclaimerFooter)
      .last()
      .contains('* Inkl. MwSt. evtl. zzgl. Versandkosten')
      .should('be.visible');
  });
});
