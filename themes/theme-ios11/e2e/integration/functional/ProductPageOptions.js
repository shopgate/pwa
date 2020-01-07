import els from '../../elements/de';
import { clearProductsFromCart } from '../../helper/cart';
import { goBrowsePage } from '../../helper/navigation'
import { navigateCategoryBySelector } from '../../helper/category';

describe('functional test product page options', () => {
  before(goBrowsePage);

  after(clearProductsFromCart);

  it('should check for options select', () => {
    navigateCategoryBySelector(els.productWithOptionsCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.simpleProductWithOptionsNameProductGrid)
        .should('be.visible')
        .click();
    });

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
    cy.get(els.addToCartBarButton)
      .should('be.visible')
      .click();
    cy.get(els.cartButton += ' div')
      .contains('1');

    cy.go('back');
  });
});
