/// <reference types="Cypress" />

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
  cy.get(els.favoriteButton)
    .should('be.visible')
    .last()
    .click();
  cy.go('back');
  cy.go('back');
  cy.get(els.navigatorButton)
    .should('be.visible')
    .click()
    .wait(1000);
  cy.get(els.navDrawerFavoritesButton)
    .should('be.visible')
    .click();
  cy.get(els.favoriteButton)
    .should('be.visible')
    .last()
    .click();
});
});