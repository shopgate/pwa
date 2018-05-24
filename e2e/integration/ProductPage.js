/// <reference types="Cypress" />
import els from "../elements/de"

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

  it('should check for reviewSection', () => {
    cy.get(els.ReviewSection)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for taxDislcaimer', () => {
    cy.get(els.taxDisclaimer)
      .scrollIntoView()
      .should('be.visible');
  });

  it('it should check for submit review button', () => {
    cy.get(els.writeReviewButton)
      .should('be.visible');
  });

  it('it should ', () => {
    cy.visit('/item/393639');
    cy.get()
      .should('be.visible');
  });
});
