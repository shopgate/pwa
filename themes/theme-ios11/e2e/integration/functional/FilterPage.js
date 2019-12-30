import els from '../../elements/de';
import { goBrowsePage } from '../../helper/navigation'
import { navigateCategoryBySelector } from '../../helper/category';

describe('functional tests filter page', () => {
  before(goBrowsePage);

  after(() => {
    cy.go('back');
  });

  it('check for singe filter selection', () => {
    navigateCategoryBySelector(els.allProductCategory);

    cy.get(els.filterButton)
      .should('be.visible')
      .click();
    cy.get(els.filterListItemManufacturer)
      .should('be.visible')
      .first()
      .click();
    cy.get(els.filterAttributeManufacturer1)
      .first()
      .should('be.visible')
      .click();
    cy.get(els.applyFilterButton)
      .should('be.visible')
      .click();
    cy.get(els.manufactureFilter1FilterChip)
      .should('be.visible');
    cy.get(els.manufactureFilter1FilterChipRemove)
      .click();
    cy.get(els.manufactureFilter1FilterChip)
      .should('not.exist');
  });

  it('should add two filters', () => {
    cy.get(els.filterButton)
      .should('be.visible')
      .click();
    cy.get(els.filterListItemManufacturer)
      .first()
      .should('be.visible')
      .click();
    cy.get(els.filterAttributeManufacturer1)
      .first()
      .should('be.visible')
      .click();
    cy.get(els.applyFilterButton)
      .should('be.visible')
      .click();
    cy.get(els.manufactureFilter1FilterChip)
      .should('be.visible');
    cy.get(els.filterButton)
      .should('be.visible')
      .click();
    cy.get(els.filterListItemAccessoriesSize)
      .should('be.visible')
      .click();
    cy.get(els.filterAttributeAccessoriesSize1)
      .first()
      .should('be.visible')
      .click();
    cy.get(els.applyFilterButton)
      .should('be.visible')
      .click();
    cy.get(els.manufactureFilter1FilterChip)
      .should('be.visible');
    cy.get(els.manufactureFilter1FilterChipRemove)
      .click();
    cy.get(els.manufactureFilter1FilterChip)
      .should('not.exist');
    cy.get(els.accessoriesSizeFilterLChip)
      .should('be.visible');
    cy.get(els.accessoriesSizeFilterLChipRemove)
      .should('be.visible')
      .click();
    cy.get(els.accessoriesSizeFilterLChip)
      .should('not.exist');
  });
});
