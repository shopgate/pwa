import els from '../../elements/de';
import { goBrowsePage } from '../../helper/navigation'
import { navigateCategoryBySelector } from '../../helper/category';

describe('IOS11Test filter page', () => {
  before(goBrowsePage);

  after(() => {
    cy.go('back');
  });

  it('should check for price range slider', () => {
    navigateCategoryBySelector(els.allProductCategory);

    cy.get(els.filterButton)
      .should('be.visible')
      .click();

    cy.get(els.priceRangeSlider)
      .should('be.visible');
  });

  it('should check for filter(brand)', () => {
    cy.get(els.filterListItemManufacturer)
      .should('be.visible');
  });

  it('should check for filter options', () => {
    cy.get(els.filterListItemManufacturer)
      .last()
      .click();
    cy.get(els.filterAttributeManufacturer1)
      .first()
      .should('be.visible')
      .click();
  });

  it('should check for clear all button', () => {
    cy.get(els.clearAllButton)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for filter aplly button', () => {
    cy.get(els.applyFilterButton)
      .scrollIntoView()
      .should('be.visible');
  });
});
