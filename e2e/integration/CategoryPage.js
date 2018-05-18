/// <reference types="Cypress" />
import els from '../elements/de';

describe('AndroidGMDTest startPage', () => {
  it('should check title', () => {
    cy.visit('');

    cy.get(els.allProductCategory)
      .click();

    cy.get(els.allProductsCategoryTitle)
      .should('be.visible');
  });

  it('should check for Back Button', () => {
    cy.get(els.backButton)
      .should('be.visible');
  });

  it('should check for Search Button', () => {
    cy.get(els.searchButton)
      .should('be.visible');
  });

  it('should check for filter Button', () => {
    cy.get(els.filterButton)
      .should('be.visible');
  });

  it('should check for sorting', () => {
    cy.get(els.sortingDropDown)
      .should('be.visible');
  });

  it('should check for viewSwitch', () => {
    cy.get(els.viewSwitch)
      .should('be.visible');
  });

  it('should check for Product', () => {
    cy.get(els)
      .should('be.visible');
    cy.get(els)
      .should('be.visible');
  })
});
