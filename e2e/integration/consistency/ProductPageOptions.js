/// <reference types="Cypress" />

import els from '../../elements/de';

describe('AndroidGMDTest productPageOptions', () => {
  it('should check for options', () => {
    cy.visit('/item/31303937');
    cy.get(els.optionsPicker)
      .should('be.visible');
    cy.get(els.optionPickerGlow)
      .should('be.visible');
    cy.get(els.optionPickerBallColor)
      .should('be.visible');
  });
});