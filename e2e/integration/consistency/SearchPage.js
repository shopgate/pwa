import els from '../../elements/de';

describe('IOS11Test searchPage', () => {
  it('should check for search input', () => {
    cy.visit('');

    cy.get(els.tabBarBrowse)
      .should('be.visible')
      .click();
    cy.get(els.searchFieldInput)
      .should('be.visible');
  });

  it('should check for category list', () => {
    cy.get(els.browsePageBasicProductsCategory)
      .should('be.visible');
  });
});
