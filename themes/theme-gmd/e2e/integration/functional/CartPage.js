// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import els from '../../elements/de';
import { clearProductFromCart } from '../../helper/cart';

describe('functional tests cart page', () => {
  //commented out because a bug from webkit let this test fail everytime executing them in headless mode
  // it('check for increase / decrease quanitity', () => {
  //   cy.visit('');

  //   cy.get(els.allProductCategory)
  //     .scrollIntoView()
  //     .should('be.visible')
  //     .click();
  //   cy.get(els.productWithManyProps4GridViewName)
  //     .should('be.visible')
  //     .click();
  //   cy.get(els.addToCartButton)
  //     .should('be.visible')
  //     .click();
  //   cy.get(els.cartButton)
  //     .should('be.visible')
  //     .click();
  //   cy.get(els.quantityPicker)
  //     .should('be.visible')
  //     .click()
  //     .type(2)
  //     .wait(100)
  //     .focus()
  //     .blur();
  //   cy.get('[data-test-id="minPrice: 0 price: 398 currency: EUR"]')
  //     .should('be.visible');
  //   cy.get(els.quantityPicker)
  //     .clear()
  //     .type(1)
  //     .wait(100)
  //     .focus()
  //     .blur();
  //   cy.get('[data-test-id="minPrice: 0 price: 199 currency: EUR"]')
  //     .should('be.visible');
  // });

  it('should add second product to cart', () => {
    cy.visit('');
    cy.get(els.basicCategory)
      .scrollIntoView()
      .click();
    cy.get(els.productsWithLongNamesCat)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.productWithVeryLongName5Name)
      .last()
      .should('be.visible')
      .click();
    cy.get(els.addToCartButton)
      .click();
    cy.get(els.cartButton)
      .click();
  });

  it('should check for wrong coupon', () => {
    cy.get(els.couponFieldInput)
      .type('wrongCoupon {enter}');
    cy.get(els.basicDialogText)
      .contains('Coupon code "wrongCoupon" is not valid.');
    cy.get(els.basicDialogOkButton)
      .click();
  });

  it('should check for right coupon', () => {
    cy.get(els.couponFieldInput)
      .clear()
      .type('test1');
    cy.get(els.couponSubmitButton)
      .click();
    cy.get(els.basicDialogOkButton)
      .click();
    cy.get('[data-test-id="subTotal: 84"]')
      .should('be.visible');
  });

  it('should delete coupon from cart', () => {
    cy.get(els.deleteCouponButton)
      .click();
    cy.get(els.deleteCouponButton)
      .should('not.exist');
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
    cy.get(els.addToCartButton)
      .should('be.visible')
      .click();
    cy.get(els.cartButton)
      .should('be.visible')
      .click();
    cy.get(els.productWithChild1ColorBlackSize5CartItem)
      .should('be.visible');
  });

  it('should check for product with options', () => {
    cy.visit('')

    cy.get(els.productWithOptionsCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.simpleProductWithOptionsNameProductGrid)
      .should('be.visible')
      .click();
    cy.get(els.addToCartButton)
      .should('be.visible')
      .click();
    cy.get(els.cartButton)
      .should('be.visible')
      .click();
    cy.get(els.simpleProductWithOptionsCartItemLink)
      .should('be.visible');
    cy.get(els.cartItemLi)
      .contains('Green Ball')
      .should('be.visible');
    cy.get(els.cartItemLi)
      .contains('bright')
      .should('be.visible');
  });

  it('should check for delete product from cart', () => {
    clearProductFromCart();
  });
});
