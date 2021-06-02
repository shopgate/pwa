import els from '../../elements/de';
import { goBrowsePage } from '../../helper/navigation'
import { navigateCategoryBySelector } from '../../helper/category';

describe('functional tests category page', () => {
  before(goBrowsePage);

  it('should check for back button', () => {
    navigateCategoryBySelector(els.allProductCategory);

    cy.get(els.sortingDropDown)
      .first()
      .click();
    cy.get(els.sortingAscButton)
      .click();
    cy.get(els.prodcutWithStrikePrice3GridPrice)
      .should('be.visible');
    cy.get(els.sortingDropDown)
      .first()
      .click();
    cy.get(els.sortingDescButton)
      .click();
    cy.get(els.productWithLongDesciption4GridPrice)
      .should('be.visible');
  });
});
