import els from '../../elements/de';

describe('AndroidGMDTest CartPageCoupons', () => {
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
