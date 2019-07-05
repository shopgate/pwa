import els from '../../elements/de';
import { navigateCategoryBySelector } from '../../helper/category';

describe('AndroidGMDTest CategoryPage', () => {
  it('should check category view elements', () => {
    cy.visit('');

    navigateCategoryBySelector(els.allProductCategory);

    cy.get(els.allProductsCategoryTitle)
      .should('be.visible');

    cy.get(els.searchButton)
      .should('be.visible');

    cy.get(els.filterButton)
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

  it('should check for strike price', () => {
    cy.visit('/category');

    navigateCategoryBySelector(els.basicCategory);

    navigateCategoryBySelector(els.productsWithStrikePriceCategory);

    cy.get(els.productWithStrikePrice4GridViewStrikePrice)
      .should('be.visible');
    cy.get(els.productWithStrikePrice4GridViewDiscountBadge)
      .should('be.visible');
    cy.get(els.productWithStrikePrice4GridViewPrice);
  });

  it('should check for rating stars', () => {
    cy.visit('/category');

    navigateCategoryBySelector(els.basicCategory);

    navigateCategoryBySelector(els.productsWithRatingsCategory);

    cy.get(els.productWithRating4GridViewRatingStars)
      .last()
      .scrollIntoView()
      .should('be.visible');
  });
});
