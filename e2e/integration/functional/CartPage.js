import els from '../../elements/de';
import { clearProductsFromCart } from '../../helper/cart';
import { navigateCategoryBySelector } from '../../helper/category';
import { goBrowsePage } from '../../helper/navigation'

describe('functional tests cart page', () => {
  before(goBrowsePage);

  after(clearProductsFromCart);

  it('check for increase / decrease quantity', () => {
    navigateCategoryBySelector(els.allProductCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithManyProps4GridViewName)
        .last()
        .should('be.visible')
        .click();
    });

    cy.spyAction('RECEIVE_CART', () => cy.get(els.addToCartBarButton).click());
    cy.spyAction('ROUTE_DID_ENTER', () => cy.get(els.cartButton).click());

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

    cy.go('back');
    cy.go('back');
  });

  it('should add sescond product to cart', () => {
    goBrowsePage();

    navigateCategoryBySelector(els.basicCategory);
    navigateCategoryBySelector(els.productsWithLongNamesCat);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithVeryLongName5Name)
        .last()
        .click();
    });

    cy.get(els.addToCartBarButton).click();
    cy.go('back');
  });

  it('should check for products with variants', () => {
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
      .click()
      .wait(2000);

    cy.spyAction('RECEIVE_CART', () => cy.get(els.addToCartBarButton).click());
    cy.spyAction('ROUTE_DID_ENTER', () => cy.get(els.cartButton).click());

    cy.get(els.productWithChild1ColorBlackSize5CartItem)
      .should('be.visible');

    cy.go('back');
    cy.go('back');
  });
});
