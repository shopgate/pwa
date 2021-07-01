import els from '../elements/de';

/**
 * Helper function that log out the user
 */
export function checkForWrongCoupon() {
  cy.get(els.basicDialogText)
    .should('be.visible')
    .then(($basicDialogText) => {
      if ($basicDialogText.text().includes('Coupon code "wrongCoupon" is not valid.')) {
        cy.get(els.basicDialogOkButton)
          .click();
      } else if ($basicDialogText.text().includes('The coupon code in not valid. Please check it to ensure that it is correct.')) {
        cy.get(els.basicDialogOkButton)
          .click();
      } else if ($basicDialogText.text().includes('Der Gutscheincode ist ungültig!')) {
        cy.get(els.basicDialogOkButton)
          .click();
      }
    });
}
