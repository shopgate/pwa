import els from '../../elements/de';
import { navigateCategoryBySelector } from '../../helper/category';
import { goCategoriesPage, goFavoritesPage } from '../../helper/navigation';

describe('e2e functional test favoritePageOptions', () => {
  before(goCategoriesPage);

  it('should add product with options to favlist', () => {
    navigateCategoryBySelector(els.productsWithOptionsCategory);

    cy.spyAction('RECEIVE_PRODUCT_CACHED', () => {
      cy.get(els.visiblePage).within(() => {
        cy.get(els.simpleProductWithOptionsNameProductGrid)
          .should('be.visible')
          .click();
      });
    });

    cy.spyAction('RECEIVE_FAVORITES', () => {
      cy.get(els.favoriteButtonProductPage)
        .should('be.visible')
        .last()
        .click();
    });

    goFavoritesPage();

    cy.get(els.favoriteButtonFavList)
      .should('be.visible')
      .last()
      .click();

    cy.get(els.favoritesPageEmptyFavComponent)
      .should('be.visible');
  });
});
