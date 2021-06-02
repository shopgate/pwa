import els from '../../elements/de';
import { clearProductsFromCart } from '../../helper/cart';
import { goBrowsePage } from '../../helper/navigation'
import { navigateCategoryBySelector } from '../../helper/category';

describe('functional tests cart page', () => {
  before(goBrowsePage);

  after(() => {
    cy.go('back');
    cy.go('back');
    clearProductsFromCart();
  });

  it('should check for product with options', () => {
    navigateCategoryBySelector(els.productWithOptionsCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.simpleProductWithOptionsNameProductGrid)
        .should('be.visible')
        .click();
    });

    cy.spyAction('RECEIVE_CART', () => cy.get(els.addToCartBarButton).click());
    cy.spyAction('ROUTE_DID_ENTER', () => cy.get(els.cartButton).click());

    cy.get(els.simpleProductWithOptionsCartItemLink)
      .should('be.visible');
    cy.get(els.cartItemLi)
      .contains('Green Ball')
      .should('be.visible');
    cy.get(els.cartItemLi)
      .contains('bright')
      .should('be.visible');
  });
});
