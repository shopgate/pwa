import els from '../../elements/de';

describe('IOS11Test productPageOption', () => {
  it('should check for options', () => {
    cy.visit('/item/31303937');
    cy.get(els.optionsPicker)
      .should('be.visible');
    cy.get(els.optionPickerGlow)
      .should('be.visible');
    cy.get(els.optionPickerBallColor)
      .should('be.visible');
  });

  it('should check for base price', () => {
    cy.visit('/item/393132');
    cy.get(els.productWithBasePrice1basePrice)
      .scrollIntoView()
      .should('be.visible');
  });
});
