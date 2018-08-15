// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import els from '../../elements/de';

describe('AndroidGMDTest CategoryPage', () => {
  it('should check title', () => {
    cy.visit('');

    cy.get(els.allProductCategory)
      .click();

    cy.get(els.allProductsCategoryTitle)
      .should('be.visible');
  });

  it('should check for Back Button', () => {
    cy.get(els.backButton)
      .should('be.visible');
  });

  it('should check for Search Button', () => {
    cy.get(els.searchButton)
      .should('be.visible');
  });

  it('should check for filter Button', () => {
    cy.get(els.filterButton)
      .should('be.visible');
  });

  it('should check for sorting', () => {
    cy.get(els.sortingDropDown)
      .should('be.visible');
  });

  it('should check for viewSwitch', () => {
    cy.get(els.viewSwitch)
      .should('be.visible');
  });

  it('should check for Product in grid view', () => {
    cy.get(els.productWithManyProps4GridViewImage)
      .should('be.visible');
    cy.get(els.productWithManyProps4GridViewName)
      .should('be.visible');
    cy.get(els.productWithManyProps4GridViewFavButton)
      .should('be.visible');
    cy.get(els.productWithManyProps4GridViewPrice)
      .should('be.visible');
  });

  it('should check for product in list view', () => {
    cy.get(els.viewSwitch)
      .click();
    cy.get(els.productWithManyProps4ListViewImage)
      .should('be.visible');
    cy.get(els.productWithManyProps4ListViewName)
      .should('be.visible');
    cy.get(els.productWithManyProps4ListViewPrice)
      .should('be.visible');
  });

  it('should check for strike price', () => {
    cy.visit('/category/3630');
    cy.get(els.productWithStrikePrice4GridViewStrikePrice)
      .should('be.visible');
    cy.get(els.productWithStrikePrice4GridViewDiscountBadge)
      .should('be.visible');
    cy.get(els.productWithStrikePrice4GridViewPrice);
    // Switch to List view
    cy.get(els.viewSwitch)
      .click();
    cy.get(els.productWithStrikePrice4listViewStrikePrice)
      .should('be.visible');
    cy.get(els.productWithStrikePrice4ListViewDiscountBadge)
      .should('be.visible');
    cy.get(els.productWithStrikePrice4ListViewPrice)
      .should('be.visible');
  });

  it('should check for rating stars', () => {
    cy.visit('/category/3633');
    cy.get(els.productWithRating4GridViewRatingStars)
      .should('be.visible');
    // Switch to List View
    cy.get(els.viewSwitch)
      .click();
    cy.get(els.productWithRating4ListViewRatingStars)
      .should('be.visible');
  });
});
