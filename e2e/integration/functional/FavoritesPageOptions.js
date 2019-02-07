import els from '../../elements/de';

describe('e2e functional test favoritePageOptions', () => {
  it('should add product with options to favlist', () => {
    cy.visit('');

    cy.get(els.productWithOptionsCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.simpleProductWithOptionsNameProductGrid)
      .should('be.visible')
      .click();
    cy.get(els.favoriteButton)
      .should('be.visible')
      .last()
      .click();
    cy.go('back');
    cy.go('back');
    cy.get(els.tabBarFavorites)
      .should('be.visible')
      .click();
    cy.get(els.favoriteButton)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.favoritesPageEmptyFavComponent)
      .should('be.visible');
  });
  it('should check for empty fav list', () => {
    cy.visit('/favourite_list');
    cy.get(els.favoritesPageEmptyFavComponent)
      .should('be.visible');
  });
});
