import els from '../../elements/de';
import { navigateCategoryBySelector } from '../../helper/category';
import { goBrowsePage } from '../../helper/navigation'

describe('IOS11Test productPage', () => {
  before(goBrowsePage);

  it('should check for productImage', () => {
    navigateCategoryBySelector(els.allProductCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithManyProps4GridViewName)
        .last()
        .click();
    });

    // Check for Image
    cy.get(els.productWithManyProps4ProductPageImage).should('be.visible');
    cy.get(els.productWithManyProps4ProductPagName).should('be.visible');
    cy.get(els.productWithManyProps4ProductPageTitle).should('be.visible');
    cy.get(els.productWithManyProps4ProductPageAvailabilityText).should('be.visible');
    cy.go('back');
  });

  it('should check for manufacturer', () => {
    goBrowsePage();

    navigateCategoryBySelector(els.basicCategory);
    navigateCategoryBySelector(els.productsWithManufacturerPropCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithManufacturerPropGridViewItem)
        .should('be.visible')
        .last()
        .click();
    });

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithManufacturerPropManufacturerProp)
        .should('be.visible');
      cy.get(els.productWithManufacturerPropManufacturerPropList)
        .scrollIntoView()
        .should('be.visible');
      cy.get(els.productWithManufacturerPropProductDetailPagePrice)
        .should('be.visible');
      cy.get(els.productWithManufactruerPropProductDetailPageDescription)
        .scrollIntoView()
        .should('be.visible');
      cy.get(els.favoriteButton)
        .should('be.visible');
      cy.get(els.taxDisclaimer)
        .scrollIntoView()
        .should('be.visible');
    });
    cy.get(els.addToCartBarButton)
      .should('be.visible');

    cy.go('back');
  });

  it('should check for reviewSection', () => {
    goBrowsePage();

    navigateCategoryBySelector(els.basicCategory);
    navigateCategoryBySelector(els.productsWithRatingsCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithRating3GridView)
        .should('be.visible')
        .last()
        .click();
    });

    cy.get(els.ReviewSection)
      .scrollIntoView()
      .should('be.visible');
    cy.get(els.writeReviewButton)
      .scrollIntoView()
      .should('be.visible');
    cy.get(els.ratingStars)
      .should('be.visible');
    cy.get(els.productWithRating3Review1Title)
      .scrollIntoView()
      .should('be.visible');
    cy.get(els.productWithRating3Review2Title)
      .scrollIntoView()
      .should('be.visible');
    cy.get(els.showAllReviewsButton)
      .should('be.visible');
    cy.go('back');
  });

  it('should check for variants', () => {
    goBrowsePage();

    navigateCategoryBySelector(els.productVariantsCategory);
    navigateCategoryBySelector(els.productsWith2VariantsCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithChild1GridView)
        .should('be.visible')
        .last()
        .click();
    });
    cy.get(els.variantPickerColor)
      .should('be.visible');
    cy.get(els.variantPickerShoeSize)
      .should('be.visible');
    cy.go('back');
  });

  it('should check for strike price', () => {
    goBrowsePage();

    navigateCategoryBySelector(els.basicCategory);
    navigateCategoryBySelector(els.productsWithStrikePriceCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithStrikePrice4GridViewItem)
        .should('be.visible')
        .last()
        .click();
    });
    cy.get(els.productWithStrikePrice4StrikePrice)
      .should('be.visible');
    cy.go('back');
  });
});
