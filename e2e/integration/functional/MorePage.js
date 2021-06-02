import els from '../../elements/de';
import { goMorePage } from '../../helper/navigation'

describe('functional tests more page', () => {
  before(goMorePage);

  it('should check for back button', () => {
    cy.get(els.backButton)
      .should('be.visible')
      .click();
  });
});
