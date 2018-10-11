/// <reference types="Cypress" />

import els from '../../elements/de';

describe('functional tests category page', () => {
  it('check for navigation', () => {
    cy.visit('');

    cy.get(els.allProductCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.backButton)
      .should('be.visible')
      .click();
    cy.get(els.shopLogo)
      .should('be.visible');
  });

  it('check for sorting', () => {
    cy.get(els.allProductCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.sortingDropDown)
      .click();
    cy.get(els.sortingAscButton)
      .click();
    cy.get(els.prodcutWithStrikePrice3GridPrice)
      .should('be.visible');
    cy.get(els.sortingDropDown)
      .click();
    cy.get(els.sortingDescButton)
      .click();
    cy.get(els.productWithLongDesciption4GridPrice)
      .should('be.visible');
  });

  it('check for sorting reset', () => {
    cy.get(els.backButton)
      .click();
    cy.get(els.allProductCategory)
      .should('be.visible')
      .click();
    cy.get("[data-test-id='sorting'] [data-test-id='filter.sort.most_popular']")
      .should('be.visible');
  });
});
