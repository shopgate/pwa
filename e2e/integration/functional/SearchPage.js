import els from '../../elements/de';

describe('functional tests search page', () => {
  it('check for navigation', () => {
    cy.visit('');

    cy.get(els.tabBarBrowse)
      .should('be.visible')
      .click();
    cy.get(els.searchFieldInput)
      .should('be.visible');
    cy.get(els.backButton)
      .click();
    cy.get(els.shopLogo)
      .should('be.visible');
    cy.get(els.tabBarBrowse)
      .click();
    cy.get(els.searchFieldInput)
      .should('be.visible')
      .click();
  });

  it('should search with fitting products', () => {
    cy.get(els.tabBarBrowse)
      .should('be.visible')
      .click();
    cy.get(els.searchFieldInput)
      .should('be.visible')
      .type('product with many properties -4- {enter}');
    cy.get(els.productWithManyProps4SearchResult)
      .should('be.visible');
    cy.get(els.backButton)
      .click();
    cy.get(els.searchFieldInput)
      .should('be.visible')
      .clear()
      .type('product with many properties -3- {enter}');
    cy.get(els.productWithManyProps3SearchResult)
      .should('be.visible');
    cy.get(els.backButton)
      .click();
  });

  it('should search with no fitting products', () => {
    cy.get(els.searchFieldInput)
      .clear()
      .type('kfkfkf {enter}');
    cy.get(els.noResultText)
      .contains('Ihre Suche nach "kfkfkf " liefert keine Ergebnisse.')
      .last()
      .should('be.visible');
    cy.get(els.backButton)
      .click();
  });

  it('it should check for suggestions', () => {
    cy.get(els.searchFieldInput)
      .should('be.visible')
      .clear()
      .type('product');
    cy.get("[data-test-id='searchSuggestion Product']")
      .should('be.visible');
    cy.get("[data-test-id='searchSuggestion Product with child']")
      .should('be.visible');
    cy.get("[data-test-id='searchSuggestion Product with many']")
      .should('be.visible');
  });
});
