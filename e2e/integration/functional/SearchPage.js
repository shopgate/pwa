import els from '../../elements/de';
import { goHomePage } from '../../helper/navigation';

describe('function tests search page', () => {
  before(goHomePage);

  after(() => {
    // CloseBar
    cy.go('back');
  });

  it('should search with fitting products', () => {
    cy.get(els.searchButton)
      .should('be.visible')
      .click()
      .wait(2000);
    cy.get(els.searchInput)
      .click()
      .should('be.visible')
      .type('product with many properties -4- {enter}');
    cy.get(els.productWithManyProps4SearchResult)
      .should('be.visible');
    cy.go('back');
    cy.get(els.searchButton)
      .should('be.visible')
      .click();
    cy.get(els.searchInput)
      .type('product with many properties -3- {enter}');
    cy.get(els.productWithManyProps3SearchResult)
      .should('be.visible');
    cy.go('back');
  });

  it('should search again with fitting product', () => {
    cy.get(els.searchButton)
      .should('be.visible')
      .click()
      .wait(2000);
    cy.get(els.searchInput)
      .click()
      .should('be.visible')
      .type('product with many properties -4- {enter}');
    cy.get(els.productWithManyProps4SearchResult)
      .should('be.visible');
    cy.go('back');
    cy.get(els.searchButton)
      .should('be.visible')
      .click();
    cy.get(els.searchInput)
      .type('product with many properties -3- {enter}');
    cy.get(els.productWithManyProps3SearchResult)
      .should('be.visible');
    cy.go('back');
  });

  it('should seach with no fitting products', () => {
    cy.get(els.searchButton)
      .should('be.visible')
      .click();
    cy.get(els.searchInput)
      .type('kfkfkf {enter}');
    cy.get(els.noResultText)
      .contains('Ihre Suche nach "kfkfkf" liefert keine Ergebnisse.')
      .should('be.visible');
    cy.go('back');
  });

  it('should check for suggestions', () => {
    cy.get(els.searchButton)
      .should('be.visible')
      .click();
    cy.get(els.searchInput)
      .type('product');
    cy.get("[data-test-id='searchSuggestion Product']")
      .should('be.visible');
    cy.get("[data-test-id='searchSuggestion Product with child']")
      .should('be.visible');
    cy.get("[data-test-id='searchSuggestion Product with many']")
      .should('be.visible');
  });
});
