import els from '../../elements/de';
import { navigateCategoryBySelector } from '../../helper/category';
import { goBrowsePage, goFavoritesPage } from '../../helper/navigation'

describe('e2e functional test favoritePageOptions', () => {
  before(goBrowsePage);

  it('should add product with options to favlist', () => {
    navigateCategoryBySelector(els.productWithOptionsCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.simpleProductWithOptionsNameProductGrid)
        .should('be.visible')
        .click();
    });
    cy.get(els.visiblePage).within(() => {
      cy.get(els.favoriteButton)
        .should('be.visible')
        .last()
        .click();
    });

    cy.go('back');

    goFavoritesPage();

    cy.get(els.visiblePage).within(() => {
      cy.spyAction('SUCCESS_REMOVE_FAVORITES', () => {
        cy.get(els.favoriteButton)
          .should('be.visible')
          .last()
          .click();
      });
    });
  });

  it('should check for empty fav list', () => {
    cy.get(els.favoritesPageEmptyFavComponent)
      .should('be.visible');
  });
});
