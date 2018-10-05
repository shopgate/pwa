/// <reference types="Cypress" />

import els from '../../elements/de';

describe('AndroidGMDTest FavoritesPage', () => {
  it('it should check for favorites placeholder', () => {
    cy.visit('');

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

  it('should check for back button', () => {
    cy.get(els.backButton)
      .should('be.visible');
  });

  it('should check for Item', () => {
    cy.visit('');

    cy.get(els.allProductCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.productWithManyProps4GridViewName)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.reload();
    cy.get(els.favoriteButton)
      .should('be.visible')
      .click();
    cy.wait(2000)
    cy.visit('');

    cy.get(els.navigatorButton)
      .should('be.visible')
      .click();
    cy.get(els.navDrawerFavoritesButton)
      .should('be.visible')
      .click();
    cy.get(els.productWithManyProps4Link)
      .should('be.visible');
    cy.reload();
  });

  it('should check for price', () => {
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
    cy.get(els.favoriteButton)
      .should('be.visible')
      .click();
    cy.get(els.favoritesPageEmptyFavComponent)
      .should('be.visible');
  });
});
