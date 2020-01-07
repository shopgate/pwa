import els from '../../elements/de';
import { navigateCategoryBySelector } from '../../helper/category';
import { goCategoriesPage, goHomePage } from '../../helper/navigation';

describe('AndroidGMDTest CategoryPage', () => {
  before(goHomePage);

  it('check for navigation', () => {
    navigateCategoryBySelector(els.allProductCategory);
    cy.go('back');
    cy.get(els.shopLogo).should('be.visible');
  });

  it('should check category view elements', () => {
    navigateCategoryBySelector(els.allProductCategory);

    cy.get(els.allProductsCategoryTitle)
      .should('be.visible');

    cy.get(els.searchButton)
      .should('be.visible');

    cy.get(els.filterButton)
      .should('be.visible');
  });

  it('should check for Product in grid view', () => {
    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithManyProps4GridViewImage)
        .first()
        .scrollIntoView()
        .should('be.visible');
      cy.get(els.productWithManyProps4GridViewName)
        .should('be.visible');
      cy.get(els.productWithManyProps4GridViewFavButton)
        .should('be.visible');
      cy.get(els.productWithManyProps4GridViewPrice)
        .should('be.visible');
    });
  });

  it('should check for strike price', () => {
    goCategoriesPage();

    navigateCategoryBySelector(els.basicCategory);

    navigateCategoryBySelector(els.productsWithStrikePriceCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithStrikePrice4GridViewStrikePrice)
        .should('be.visible');
      cy.get(els.productWithStrikePrice4GridViewDiscountBadge)
        .should('be.visible');
      cy.get(els.productWithStrikePrice4GridViewPrice);
    });
  });

  it('should check for rating stars', () => {
    goCategoriesPage();

    navigateCategoryBySelector(els.basicCategory);

    navigateCategoryBySelector(els.productsWithRatingsCategory);

    cy.get(els.productWithRating4GridViewRatingStars)
      .last()
      .scrollIntoView()
      .should('be.visible');
  });
});
