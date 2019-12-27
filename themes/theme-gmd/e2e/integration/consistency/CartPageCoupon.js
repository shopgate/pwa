import { clearProductsFromCart } from '../../helper/cart';
import els from '../../elements/de';
import { goHomePage } from '../../helper/navigation';

describe('AndroidGMDTest CartPageCoupons', () => {
  before(goHomePage);

  after(clearProductsFromCart);

  it('should add second product to cart', () => {
    cy.get(els.basicCategory)
      .last()
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.productsWithLongNamesCat)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.loadingIndicator)
      .should('not.be.visible');
    cy.get(els.productWithVeryLongName5Name)
      .last()
      .should('be.visible')
      .click();

    cy.spyAction('RECEIVE_CART', () => cy.get(els.addToCartButton).click())
      .then(() => (
        cy.spyAction('ROUTE_DID_ENTER', () => cy.get(els.cartButton).last().click())
      ));
  });

  it('should check for couponField', () => {
    cy.get(els.couponFieldInput)
      .should('be.visible')
      .type('test');
    cy.get(els.couponSubmitButton)
      .should('be.visible');
  });
});
