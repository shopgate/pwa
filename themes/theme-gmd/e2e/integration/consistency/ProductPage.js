import els from '../../elements/de';
import { navigateCategoryBySelector } from '../../helper/category';
import { goCategoriesPage } from '../../helper/navigation';

describe('AndroidGMDTest productPage', () => {
  before(goCategoriesPage);

  it('should check for productImage', () => {
    navigateCategoryBySelector(els.allProductCategory);

    cy.get(els.productWithManyProps4GridViewName)
      .last()
      .scrollIntoView()
      .click();

    // Check for Image
    cy.get(els.productWithManyProps4ProductPageImage)
      .should('be.visible');
  });

  it('shoud check for productName', () => {
    cy.get(els.productWithManyProps4ProductPagName)
      .should('be.visible');
  });

  it('should check for PpoductTitle', () => {
    cy.get(els.productWithManyProps4ProductPageTitle)
      .should('be.visible');
  });

  it('should check for availabilityText', () => {
    cy.get(els.productWithManyProps4ProductPageAvailabilityText)
      .should('be.visible');
  });

  it('should check for manufacturer', () => {
    goCategoriesPage();

    navigateCategoryBySelector(els.basicCategory);

    navigateCategoryBySelector(els.productsWithManufacturerPropCategory);

    cy.get(els.productWithManufacturerPropGridViewItem)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.productWithManufacturerPropManufacturerProp)
      .scrollIntoView()
      .should('be.visible');
    cy.get(els.productWithManufacturerPropManufacturerPropList)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for pricing', () => {
    cy.get(els.productWithManufacturerPropProductDetailPagePrice)
      .should('be.visible');
  });

  it('should check for desctiption', () => {
    cy.get(els.descriptionText)
      .contains('Product with manufacture prop')
      .should('be.visible');
  });

  it('should check for addToCartButton', () => {
    cy.get(els.addToCartButton)
      .should('be.visible');
  });

  it('should check for favorite button', () => {
    cy.get(els.favoriteButton)
      .should('be.visible');
  });

  it('should check for taxDislcaimer', () => {
    cy.get(els.taxDisclaimer)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for reviewSection', () => {
    goCategoriesPage();

    navigateCategoryBySelector(els.basicCategory);

    navigateCategoryBySelector(els.productsWithRatingsCategory);

    cy.get(els.productWithRating3GridView)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.reviewSection)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for submit review button', () => {
    cy.get(els.writeReviewButton)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for reviewStars', () => {
    cy.get(els.ratingStars)
      .should('be.visible');
  });

  it('should check for review preview', () => {
    cy.get(els.productWithRating3Review1Title)
      .scrollIntoView()
      .should('be.visible');
    cy.get(els.productWithRating3Review2Title)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for show all reviews button', () => {
    cy.get(els.showAllReviewsButton)
      .should('be.visible');
  });

  it('should check for variants', () => {
    goCategoriesPage();

    navigateCategoryBySelector(els.productVariantsCategory);

    navigateCategoryBySelector(els.productsWith2VariantsCategory);

    cy.get(els.productWithChild1GridView)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.variantPickerColor)
      .should('be.visible');
    cy.get(els.variantPickerShoeSize)
      .should('be.visible');
  });

  it('should check for strike price', () => {
    goCategoriesPage();

    navigateCategoryBySelector(els.basicCategory);

    navigateCategoryBySelector(els.productsWithStrikePriceCategory);

    cy.get(els.productWithStrikePrice4GridViewItem)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.productWithStrikePrice4StrikePrice)
      .should('be.visible');
  });
});
