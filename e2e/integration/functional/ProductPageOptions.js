import els from '../../elements/de';
import { clearProductsFromCart } from '../../helper/cart';

describe('functional test product page', () => {
  after(clearProductsFromCart);

  it('should check for options select', () => {
    cy.visit('');

    cy.get(els.productWithOptionsCategory)
      .scrollIntoView()
      .click();
    cy.get(els.simpleProductWithOptionsNameProductGrid)
      .should('be.visible')
      .click();
    cy.get(els.optionPickerBallColor)
      .should('be.visible')
      .click();
    cy.get(els.redBallColorOption)
      .last()
      .should('be.visible')
      .click();
    cy.wait(1000);
    cy.get(els.optionPickerGlow)
      .should('be.visible')
      .click();
    cy.get(els.lowGlowOption)
      .last()
      .should('be.visible')
      .click();
    cy.get('[data-test-id="Ball color"] span')
      .contains('Red Ball')
      .should('be.visible');
    cy.get('[data-test-id="glow"] span')
      .contains('low')
      .should('be.visible');
    cy.wait(1000);
    cy.get(els.addToCartButton)
      .should('be.visible')
      .click();
    cy.get(els.cartButton)
      .contains('1');
  });
});
