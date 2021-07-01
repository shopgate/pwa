import els from '../../elements/de';
import { goCategoriesPage } from '../../helper/navigation';
import { navigateCategoryBySelector } from '../../helper/category';

describe('functional tests category page', () => {
  before(goCategoriesPage);

  it('check for sorting', () => {
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
    cy.get(els.loadingIndicator)
      .should('not.be.visible');
    cy.get(els.productWithLongDesciption4GridPrice)
      .should('be.visible');
  });
});

