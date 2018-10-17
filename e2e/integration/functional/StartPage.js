/// <reference types="Cypress" />

import els from '../../elements/de';

describe('functional test start page', () => {
  it('check for live shopping widget', () => {
    cy.visit('');

    cy.get(els.liveShoppingWidgetWithExpectedProduct)
      .should('be.visible')
      .click();
    cy.get(els.productWithBasePrice1ProductPageName)
      .should('be.visible');
    cy.get(els.backButton)
      .should('be.visible')
      .click();
  });

  it('check for image widget', () => {
    cy.get(els.imageWidgetWithLink1)
      .should('be.visible')
      .click();
    cy.get(els.basicProductsCategoryTitle)
      .should('be.visible');
    cy.get(els.backButton)
      .should('be.visible')
      .click();
  });

  it('check for product slider', () => {
    cy.get(els.productSliderProduct1)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.productWithLongDesciption4ProductPageName)
      .should('be.visible');
    cy.get(els.backButton)
      .should('be.visible')
      .click();
  });

  it('check for category list', () => {
    cy.wait(1000);
    cy.get(els.allProductCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.allProductsCategoryTitle)
      .should('be.visible');
    cy.get(els.backButton)
      .should('be.visible')
      .click();
  });

  it('should check for product list grid', () => {
    cy.get(els.productGridWidgetSecondProduct)
      .should('be.visible')
      .scrollIntoView()
      .click();
    cy.get(els.productWithManyProps4ProductPagName)
      .should('be.visible');
    cy.get(els.backButton)
      .should('be.visible')
      .click();
  });

  it('should check for product list', () => {
    cy.wait(1000);
    cy.get(els.productListWidgetSecondProduct)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.productWithManyProps4ProductPagName)
      .should('be.visible');
  });
});
