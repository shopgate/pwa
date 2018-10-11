/// <reference types="Cypress" />

import els from '../../elements/de';

describe('AndroidGMDTest productPage', () => {
  it('should check for productImage', () => {
    cy.visit('');
    // Naviagte to product
    cy.get(els.allProductCategory)
      .click();
    cy.get(els.productWithManyProps4GridViewName)
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
    cy.visit('/category/');
    cy.get(els.basicCategory)
      .should('be.visible')
      .click();
    cy.get(els.productsWithManufacturerPropCategory)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.productWithManufacturerPropGridViewItem)
      .should('be.visible')
      .last()
      .click();
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
    cy.visit('/category/');
    cy.get(els.basicCategory)
      .should('be.visible')
      .click();
    cy.get(els.productsWithRatingsCategory)
      .should('be.visible')
      .last()
      .click();
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
    cy.visit('/category/');
    cy.get(els.productVariantsCategory)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.productsWith2VariantsCategory)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.productWithChild1GridView)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.variantsPicker)
      .should('be.visible');
    cy.get(els.variantPickerColor)
      .should('be.visible');
    cy.get(els.variantPickerShoeSize)
      .should('be.visible');
  });

  it('should check for strike price', () => {
    cy.visit('/category/');
    cy.get(els.basicCategory)
      .should('be.visible')
      .click();
    cy.get(els.productsWithStrikePriceCategory)
      .last()
      .should('be.visible')
      .click();
    cy.get(els.productWithStrikePrice4GridViewItem)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.productWithStrikePrice4StrikePrice)
      .should('be.visible');
  });
});
