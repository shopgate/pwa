/// <reference types="Cypress" />

import els from '../../elements/de';

describe('functional test filter page', () => {
  it('should check for single selection', () => {
    cy.visit('');

    cy.get(els.allProductCategory).first()
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.filterButton)
      .should('be.visible')
      .click();
    cy.get(els.filterListItemManufacturer)
      .should('be.visible')
      .first()
      .click();
    cy.get(els.filterAttributeManufacturer1)
      .should('be.visible')
      .click();
    cy.get(els.applyFilterButton)
      .should('be.visible')
      .click();
    cy.get(els.manufactureFilter1FilterChip)
      .should('be.visible');
    cy.get(els.manufactureFilter1FilterChipRemove)
      .click();
  });
});
