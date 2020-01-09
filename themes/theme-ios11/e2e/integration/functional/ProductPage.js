import els from '../../elements/de';
import { clearProductsFromCart } from '../../helper/cart';
import { goBrowsePage } from '../../helper/navigation'
import { navigateCategoryBySelector } from '../../helper/category';

describe('functional test product page', () => {
  before(goBrowsePage);

  after(clearProductsFromCart);

  it('should check for correct error message if no variant are selected', () => {
    navigateCategoryBySelector(els.productVariantsCategory);
    navigateCategoryBySelector(els.productsWith2VariantsCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithChild1MotherNameProductGrid)
        .should('be.visible')
        .last()
        .click();
    });

    cy.get(els.addToCartBarButton)
      .should('be.visible')
      .click()
      .wait(1000);
    cy.get(els.cartBadge)
      .should('not.exist');

    cy.go('back');
  });

  it('should check for variant  select', () => {
    goBrowsePage();

    navigateCategoryBySelector(els.productVariantsCategory);
    navigateCategoryBySelector(els.productsWith2VariantsCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithChild1MotherNameProductGrid)
        .should('be.visible')
        .last()
        .click();
    });

    cy.get(els.variantPickerColor)
      .should('be.visible')
      .click();
    cy.get(els.blackColorVariant)
      .should('be.visible')
      .click();
    cy.get(els.variantPickerShoeSize)
      .should('be.visible')
      .click();
    cy.get(els.size5ShoeSizeVariant)
      .should('be.visible')
      .click();
    cy.wait(1000);
    cy.get('[data-test-id="Color"] div')
      .contains('Black')
      .should('be.visible');
    cy.get('[data-test-id="Shoe size"] div')
      .contains('5')
      .should('be.visible');
    cy.wait(1000);
    cy.get(els.addToCartBarButton)
      .should('be.visible')
      .click()
      .wait(1000);
    cy.get(els.cartButton += ' div')
      .should('be.visible')
      .contains('1');

    cy.go('back');
  });
});
