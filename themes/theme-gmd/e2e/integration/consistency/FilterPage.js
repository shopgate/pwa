/// <reference types="Cypress" />

import els from '../../elements/de';

describe('AndroidGMDTest filter page', () => {
  it('should check for price range slider', () => {
    cy.visit('');

    cy.get(els.allProductCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.filterButton)
      .should('be.visible')
      .click();

    cy.get(els.priceRangeSlider)
      .should('be.visible');
  });

  it('should check for filter(brand)', () => {
    cy.get(els.filterListItemManufacturer)
      .should('be.visible');
  });

  it('should check for filter options', () => {
    cy.get(els.filterListItemManufacturer)
      .first()
      .click();
    cy.get(els.filterAttributeManufacturer1)
      .should('be.visible')
      .click();
  });

  it('should check for clear all button', () => {
    cy.get(els.clearAllButton)
      .should('be.visible');
  });

  it('should check for filter aplly button', () => {
    cy.get(els.applyFilterButton)
      .scrollIntoView()
      .should('be.visible');
  });
});
