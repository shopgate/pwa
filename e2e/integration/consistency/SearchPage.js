import els from '../../elements/de';
import { goHomePage } from '../../helper/navigation';

describe('AndroidGMDTest searchPage', () => {
  before(goHomePage);

  it('should check for search input', () => {
    cy.get(els.searchButton)
      .should('be.visible')
      .first()
      .click();
    cy.get(els.searchInput)
      .should('be.visible');
  });
});
