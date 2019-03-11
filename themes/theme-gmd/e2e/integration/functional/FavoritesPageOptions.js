import els from '../../elements/de';
import { navigateCategoryBySelector } from '../../helper/category';

describe('e2e functional test favoritePageOptions', () => {
  it('should add product with options to favlist', () => {
    cy.visit('');

    navigateCategoryBySelector(els.productWithOptionsCategory);

    cy.window().spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.simpleProductWithOptionsNameProductGrid)
        .should('be.visible')
        .click();
    });
    cy.window().spyAction('RECEIVE_FAVORITES', () => {
      cy.get(els.favoriteButtonProductPage)
        .should('be.visible')
        .last()
        .click();
    });
    cy.get(els.navigatorButton)
      .last()
      .should('be.visible')
      .click()
      .wait(200);

    cy.window().spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.navDrawerFavoritesButton)
        .should('be.visible')
        .click();
    });

    cy.window().spyAction('RECEIVE_FAVORITES', () => {
      cy.get(els.favoriteButtonFavList)
        .should('be.visible')
        .last()
        .click();
    });

    cy.get(els.favoritesPageEmptyFavComponent)
      .should('be.visible');
  });
});
