import els from '../../elements/de';
import { goFavoritesPage, goHomePage } from '../../helper/navigation';
import { navigateCategoryBySelector } from '../../helper/category';

describe('AndroidGMDTest FavouritesPage', () => {
  before(goHomePage);

  it('it should check for favorites placeholder', () => {
    cy.get(els.navigatorButton)
      .should('be.visible')
      .click();
    cy.get(els.navDrawerFavoritesButton)
      .should('be.visible')
      .click();
    cy.get(els.favoritesPageEmptyFavComponent)
      .should('be.visible');
  });

  it('should check for continue shopping button', () => {
    cy.get(els.favoritesPageContinueShoppingButton)
      .should('be.visible');
  });

  it('should add Item to favorites', () => {
    goHomePage();

    navigateCategoryBySelector(els.allProductCategory);

    cy.spyAction('RECEIVE_PRODUCT_CACHED', () => {
      cy.get(els.productWithManyProps4GridViewName)
        .last()
        .scrollIntoView()
        .should('be.visible')
        .click();
    });

    cy.spyAction('SUCCESS_ADD_FAVORITES', () => {
      cy.get(els.visiblePage).within(() => {
        cy.get(els.favoriteButton)
          .should('be.visible')
          .first()
          .click();
      });
    });
  });

  it('should check favorite product data', () => {
    goFavoritesPage();

    cy.get(els.visiblePage).within(() => {
      cy.get(els.favoriteListItemProductWithManyProbs4)
        .scrollIntoView()
        .should('be.visible');
      cy.get(els.productWithManyProps4FavListPrice)
        .should('be.visible');
      cy.get(els.addToCartButton)
        .should('be.visible');
      cy.get(els.availabilityTextInStock)
        .should('be.visible');

      cy.spyAction('SUCCESS_REMOVE_FAVORITES', () => {
        cy.get(els.favoriteButton)
          .should('be.visible')
          .click();
      });

      cy.get(els.favoritesPageEmptyFavComponent)
        .should('be.visible');
    });
  });
});
