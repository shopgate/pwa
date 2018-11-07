import els from '../../elements/de';

describe('AndroidGMDTest searchPage', () => {
  it('should check for search input', () => {
    cy.visit('');

    cy.get(els.searchButton)
      .should('be.visible')
      .first()
      .click();
    cy.get(els.searchInput)
      .should('be.visible');
  });
});
