import els from '../../elements/de';
import { goBrowsePage } from '../../helper/navigation'
import { navigateCategoryBySelector } from '../../helper/category'

describe('IOS11Test CategoryPage', () => {
  before(goBrowsePage);

  it('should check title', () => {
    navigateCategoryBySelector(els.allProductCategory);

    cy.get(els.allProductsCategoryTitle)
      .should('be.visible');
  });

  it('should check for Back Button', () => {
    cy.get(els.backButton)
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

  it('should check for Product in grid view', () => {
    cy.get(els.visiblePage).within(() => {
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
  });

  it('should check for strike price', () => {
    goBrowsePage();

    navigateCategoryBySelector(els.basicCategory);
    navigateCategoryBySelector(els.productsWithStrikePriceCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithStrikePrice4GridViewStrikePrice).should('be.visible');
      cy.get(els.productWithStrikePrice4GridViewDiscountBadge).should('be.visible');
      cy.get(els.productWithStrikePrice4GridViewPrice).should('be.visible');
    });
  });

  it('should check for rating stars', () => {
    goBrowsePage();

    navigateCategoryBySelector(els.basicCategory);
    navigateCategoryBySelector(els.productsWithRatingsCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithRating4GridViewRatingStars)
        .scrollIntoView()
        .should('be.visible');
    });
  });
});
