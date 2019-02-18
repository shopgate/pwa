import els from '../../elements/de';

describe('e2e functional test favoritePage', () => {
  it('should add product with options to favlist', () => {
    cy.visit('');

    cy.get(els.productWithOptionsCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.simpleProductWithOptionsNameProductGrid)
      .should('be.visible')
      .click();
    cy.get(els.favoriteButtonProductPage)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.navigatorButton)
      .should('be.visible')
      .click()
      .wait(1000);
    cy.get(els.navDrawerFavoritesButton)
      .should('be.visible')
      .click();

    cy.window().spyAction('RECEIVE_FAVORITES', () => {
      cy.get(els.favoriteButtonFavList)
        .should('be.visible')
        .last()
        .click();
    });
  });

  it('should check for empty fav list', () => {
    cy.visit('/favourite_list');
    cy.get(els.favoritesPageEmptyFavComponent)
      .should('be.visible');
  });
});
