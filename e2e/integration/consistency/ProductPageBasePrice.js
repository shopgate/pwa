/// <reference types="Cypress" />

import els from '../../elements/de';

describe('AndroidGMDTest productPageBasePrice', () => {
  it('should check for base price', () => {
    cy.visit('/item/393132');
    cy.get(els.productWithBasePrice1basePrice)
      .scrollIntoView()
      .should('be.visible');
  });
});