import els from '../../elements/de';

describe('functional tests more page', () => {
  it('should check for back button', () => {
    cy.visit('');

    cy.get(els.tabBarMore)
      .should('be.visible')
      .click();

    cy.get(els.backButton)
      .should('be.visible')
      .click();
    cy.get(els.shopLogo)
      .should('be.visible');
  });
});
