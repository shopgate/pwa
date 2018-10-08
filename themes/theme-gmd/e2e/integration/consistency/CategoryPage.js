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
      .scrollIntoView()
      .should('be.visible');
    cy.get(els.productWithManyProps4GridViewName)
      .should('be.visible');
    cy.get(els.productWithManyProps4GridViewFavButton)
      .should('be.visible');
    cy.get(els.productWithManyProps4GridViewPrice)
      .should('be.visible');
  });

  it('should check for product in list view', () => {
    cy.reload();
    cy.get(els.viewSwitch)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.productWithManyProps4ListViewImage)
      .scrollIntoView()
      .should('be.visible');
    cy.get(els.productWithManyProps4ListViewName)
      .should('be.visible');
    cy.get(els.productWithManyProps4ListViewPrice)
      .should('be.visible');
  });

  it('should check for strike price', () => {
    cy.visit('/category/');
    cy.get(els.basicCategory)
      .should('be.visible')
      .click();
    cy.get(els.productsWithStrikePriceCategory)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.productWithStrikePrice4GridViewStrikePrice)
      .should('be.visible');
    cy.get(els.productWithStrikePrice4GridViewDiscountBadge)
      .should('be.visible');
    cy.get(els.productWithStrikePrice4GridViewPrice);
    // Switch to List view
    cy.reload();
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
    cy.visit('/category/');
    cy.get(els.basicCategory)
      .should('be.visible')
      .click();
    cy.get(els.productsWithRatingsCategory)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.productWithRating4GridViewRatingStars)
      .last()
      .scrollIntoView()
      .should('be.visible');
    // Switch to List View
    cy.reload();
    cy.get(els.viewSwitch)
      .click();
    cy.get(els.productWithRating4ListViewRatingStars)
      .should('be.visible');
  });
});
