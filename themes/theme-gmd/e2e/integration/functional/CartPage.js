import els from '../../elements/de';
import { clearProductsFromCart } from '../../helper/cart';
import { navigateCategoryBySelector } from '../../helper/category';
import { goHomePage } from '../../helper/navigation';

describe('functional tests cart page', () => {
  before(goHomePage);

  after(clearProductsFromCart);

  it('check for increase / decrease quanitity', () => {
    navigateCategoryBySelector(els.allProductCategory);

    cy.get(els.productWithManyProps4GridViewName)
      .should('be.visible')
      .click();
    cy.spyAction('RECEIVE_CART', () => {
      cy.get(els.addToCartButton)
        .last()
        .should('be.visible')
        .click();
    });
    cy.spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.cartButton)
        .last()
        .should('be.visible')
        .click();
    });
    cy.spyAction('RECEIVE_CART', () => {
      cy.get(els.quantityPicker)
        .should('be.visible')
        .click()
        .type('2')
        .focus()
        .blur();
    });
    cy.get('[data-test-id="minPrice: 0 price: 398 currency: EUR"]')
      .should('be.visible');
    cy.spyAction('RECEIVE_CART', () => {
      cy.get(els.quantityPicker)
        .clear()
        .type('1')
        .focus()
        .blur();
    });
    cy.get('[data-test-id="minPrice: 0 price: 199 currency: EUR"]')
      .should('be.visible');
  });

  it('should add second product to cart', () => {
    goHomePage();
    cy.spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.basicCategory)
        .last()
        .scrollIntoView()
        .should('be.visible')
        .click();
    });
    cy.spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.productsWithLongNamesCat)
        .should('be.visible')
        .last()
        .click();
    });

    cy.get(els.loadingIndicator).should('not.be.visible');

    cy.spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.productWithVeryLongName5Name)
        .last()
        .should('be.visible')
        .click();
    });
    cy.spyAction('RECEIVE_CART', () => {
      cy.get(els.addToCartButton)
        .last()
        .should('be.visible')
        .click();
    });
    cy.spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.cartButtonProductPage)
        .last()
        .click();
    });
  });

  it('should check for products with variants', () => {
    goHomePage();

    cy.spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.productVariantsCategory)
        .last()
        .scrollIntoView()
        .should('be.visible')
        .click();
    });
    cy.spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.productsWith2VariantsCategory)
        .should('be.visible')
        .last()
        .click();
    });

    cy.get(els.loadingIndicator).should('not.be.visible');

    cy.spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.productWithChild1MotherNameProductGrid)
        .last()
        .should('be.visible')
        .last()
        .click();
    });
    cy.get(els.variantPickerColor)
      .should('be.visible')
      .click()
      .wait(2000);
    cy.get(els.blackColorVariant)
      .should('be.visible')
      .last()
      .click()
      .wait(2000);
    cy.get(els.variantPickerShoeSize)
      .should('be.visible')
      .click()
      .wait(2000);

    // Wait until variant selection and data received
    cy.spyAction('RECEIVE_PRODUCT', () => {
      cy.get(els.size5ShoeSizeVariant)
        .should('be.visible')
        .last()
        .click();
    });

    cy.spyAction('RECEIVE_CART', () => {
      cy.get(els.addToCartButton)
        .last()
        .should('be.visible')
        .click();
    });

    cy.spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.cartButtonProductPage)
        .last()
        .should('be.visible')
        .click();
    });
    cy.get(els.productWithChild1ColorBlackSize5CartItem)
      .should('be.visible');
  });
});
