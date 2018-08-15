// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import els from '../../elements/de';

describe('AndroidGMDTest productPage', () => {
  it('should check for productImage', () => {
    cy.visit('');
    // Naviagte to product
    cy.get(els.allProductCategory)
      .click();
    cy.get(els.productWithManyProps4GridViewName)
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
    cy.visit('/item/31303637');
    cy.get(els.productWithManufacturerPropManufacturerProp)
      .should('be.visible');
    cy.get(els.productWithManufacturerPropManufacturerPropList)
      .should('be.visible');
  });

  it('should check for pricing', () => {
    cy.get(els.productWithManufacturerPropProductDetailPagePrice)
      .should('be.visible');
  });

  it('should check for desctiption', () => {
    cy.get(els.productWithManufactruerPropProductDetailPageDescription)
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
    cy.visit('/item/393339');
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
    cy.visit('/item/393639');
    cy.get(els.variantsPicker)
      .should('be.visible');
    cy.get(els.variantPickerColor)
      .should('be.visible');
    cy.get(els.variantPickerShoeSize)
      .should('be.visible');
  });

  it('should check for options', () => {
    cy.visit('/item/31303937');
    cy.get(els.optionsPicker)
      .should('be.visible');
    cy.get(els.optionPickerGlow)
      .should('be.visible');
    cy.get(els.optionPickerBallColor)
      .should('be.visible');
  });

  it('should check for base price', () => {
    cy.visit('/item/393132');
    cy.get(els.productWithBasePrice1basePrice)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for strike price', () => {
    cy.visit('/item/31303634');
    cy.get(els.productWithStrikePrice4StrikePrice)
      .should('be.visible');
  });
});
