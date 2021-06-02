import els from '../../elements/de';

import { clearProductsFromCart } from '../../helper/cart';
import { goCategoriesPage } from '../../helper/navigation';
import { navigateCategoryBySelector } from '../../helper/category';

describe('functional test cart page options', () => {
  before(goCategoriesPage);

  after(clearProductsFromCart);

  it('should check for product with options', () => {
    navigateCategoryBySelector(els.productsWithOptionsCategory);

    cy.get(els.simpleProductWithOptionsNameProductGrid)
      .last()
      .should('be.visible')
      .click()
      .wait(1000);
    cy.get(els.addToCartButton)
      .should('be.visible')
      .click();
    cy.get(els.cartButtonProductPage)
      .last()
      .should('be.visible')
      .click();
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
