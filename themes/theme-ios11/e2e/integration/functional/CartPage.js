import els from '../../elements/de';
import { clearProductFromCart } from '../../helper/cart';

describe('functional tests cart page', () => {
  it.skip('check for increase / decrease quanitity', () => {
    cy.visit('');

    cy.get(els.allProductCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.loadingIndicator)
      .should('not.be.visible');
    cy.get(els.productWithManyProps4GridViewName)
      .last()
      .should('be.visible')
      .click();
    cy.get(els.addToCartBarButton)
      .should('be.visible')
      .click();
    cy.get(els.cartButton)
      .should('be.visible')
      .click();
    cy.get(els.quantityPicker)
      .should('be.visible')
      .click()
      .type(2)
      .wait(100)
      .focus()
      .blur();
    cy.get('[data-test-id="minPrice: 0 price: 398 currency: EUR"]')
      .should('be.visible');
    cy.get(els.quantityPicker)
      .clear()
      .type(1)
      .wait(100)
      .focus()
      .blur();
    cy.get('[data-test-id="minPrice: 0 price: 199 currency: EUR"]')
      .should('be.visible');
  });

  it('should add sescond product to cart', () => {
    cy.visit('');
    cy.get(els.basicCategory)
      .last()
      .scrollIntoView()
      .click();
    cy.get(els.productsWithLongNamesCat)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.loadingIndicator)
      .should('not.be.visible');
    cy.get(els.productWithVeryLongName5Name)
      .last()
      .click();
    cy.get(els.addToCartBarButton)
      .click();
    cy.get(els.cartButton)
      .click();
  });

  it('should check for products with variants', () => {
    cy.visit('');

    cy.get(els.productVariantsCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.productsWith2VariantsCategory)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.productWithChild1MotherNameProductGrid)
      .should('be.visible')
      .last()
      .click();
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
      .click()
      .wait(2000);
    cy.get(els.addToCartBarButton)
      .should('be.visible')
      .click();
    cy.get(els.cartButton)
      .should('be.visible')
      .click();
    cy.get(els.productWithChild1ColorBlackSize5CartItem)
      .should('be.visible');
  });

  it('should check for delete product from cart', () => {
    clearProductFromCart();
  });
});
