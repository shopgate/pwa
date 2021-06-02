import els from '../../elements/de';
import { goBrowsePage } from '../../helper/navigation'

describe('IOS11Test searchPage', () => {
  before(goBrowsePage);

  it('should check for search input', () => {
    cy.get(els.searchFieldInput)
      .should('be.visible');
  });

  it('should check for category list', () => {
    cy.get(els.browsePageBasicProductsCategory)
      .should('be.visible');
  });
});
