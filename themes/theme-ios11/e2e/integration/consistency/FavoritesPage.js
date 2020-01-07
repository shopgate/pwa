import els from '../../elements/de';
import { goBrowsePage, goFavoritesPage } from '../../helper/navigation'
import { navigateCategoryBySelector } from '../../helper/category';

describe('IOS11Test FavoritesPage', () => {
  before(goFavoritesPage);

  it('should check for favorites placeholder', () => {
    cy.get(els.favoritesPageEmptyFavComponent)
      .should('be.visible');
  });

  it('should check for back button', () => {
    cy.get(els.backButton).should('be.visible');
  });

  it('should check for Item', () => {
    goBrowsePage();

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

    cy.go('back');
  });

  it('should check for price', () => {
    goFavoritesPage();

    cy.get(els.favoriteListItemProductWithManyProbs4)
      .scrollIntoView()
      .should('be.visible');

    cy.get(els.productWithManyProps4FavListPrice)
      .should('be.visible');
  });

  it('should check for cart button', () => {
    cy.get(els.addToCartButton)
      .should('be.visible');
  });

  it('should check for stock', () => {
    cy.get(els.availabilityTextInStock)
      .should('be.visible');
  });

  it('should check for favButton', () => {
    cy.spyAction('SUCCESS_REMOVE_FAVORITES', () => {
      cy.get(els.visiblePage).within(() => {
        cy.get(els.favoriteButton)
          .should('be.visible')
          .click();
      });
    });
    cy.get(els.favoritesPageEmptyFavComponent)
      .should('be.visible');
  });
});
