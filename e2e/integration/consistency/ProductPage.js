import els from '../../elements/de';

describe('IOS11Test productPage', () => {
  it('should check for productImage', () => {
    cy.visit('');
    // Naviagte to product
    cy.get(els.allProductCategory)
      .click();
    cy.get(els.loadingIndicator)
      .should('not.be.visible');
    cy.get(els.productWithManyProps4GridViewName)
      .last()
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
    cy.visit('/browse/');
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
      .should('be.visible')
      .wait(3000);
    cy.get(els.productWithManufacturerPropManufacturerPropList)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for pricing', () => {
    cy.get(els.productWithManufacturerPropProductDetailPagePrice)
      .should('be.visible');
  });

  it('should check for desctiption', () => {
    cy.get(els.productWithManufactruerPropProductDetailPageDescription)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for addToCartButton', () => {
    cy.get(els.addToCartBarButton)
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
    cy.visit('/browse/');
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
    cy.get(els.ReviewSection)
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
    cy.visit('/browse/');
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
    cy.get(els.variantPickerColor)
      .should('be.visible');
    cy.get(els.variantPickerShoeSize)
      .should('be.visible');
  });

  it('should check for strike price', () => {
    cy.visit('/browse/');
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
