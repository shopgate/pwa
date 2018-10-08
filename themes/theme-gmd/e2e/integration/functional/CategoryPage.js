// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import els from '../../elements/de';

// TODO: refactor when feature is implemented

describe('functional tests category page', () => {
  it('check for navigation', () => {
    cy.visit('');

    cy.get(els.allProductCategory).first()
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.go('back');
    cy.get(els.shopLogo)
      .should('be.visible');
  });

  it('check for sorting', () => {
    cy.get(els.allProductCategory)
      .first()
      .scrollIntoView()
      .click()
      .wait(3000);
    cy.get(els.sortingDropDown)
      .first()
      .click();
    cy.get(els.sortingAscButton)
      .click();
    cy.get(els.prodcutWithStrikePrice3GridPrice)
      .should('be.visible');
    cy.get(els.sortingDropDown)
      .first()
      .click();
    cy.get(els.sortingDescButton)
      .click();
    cy.get(els.productWithLongDesciption4GridPrice)
      .should('be.visible');
  });

  it('check for sorting reset', () => {
    cy.go('back');
    cy.get(els.allProductCategory).first()
      .should('be.visible')
      .click();
    cy.get("[data-test-id='sorting'] [data-test-id='filter.sort.most_popular']")
      .should('be.visible');
  });
});
