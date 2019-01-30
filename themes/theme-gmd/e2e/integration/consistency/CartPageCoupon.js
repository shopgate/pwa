import els from '../../elements/de';

describe('AndroidGMDTest CartPageCoupons', () => {
  it('should add second product to cart', () => {
    cy.visit('');
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
    cy.get(els.addToCartButton)
      .click();
    cy.get(els.cartButtonProductPage)
      .last()
      .click();
  });

  it('should check for couponField', () => {
    cy.get(els.couponFieldInput)
      .should('be.visible');
  });

  it('should check for submit coupon button', () => {
    cy.get(els.couponFieldInput)
      .type('test');
    cy.get(els.couponSubmitButton)
      .should('be.visible');
  });
});
