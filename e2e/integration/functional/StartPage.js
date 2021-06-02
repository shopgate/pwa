import els from '../../elements/de';
import { goHomePage } from '../../helper/navigation';

describe('functional test start page', () => {
  before(goHomePage);

  it('check for live shopping widget', () => {
    cy.get(els.liveShoppingWidgetWithExpectedProduct)
      .should('be.visible')
      .click();
    cy.get(els.productWithBasePrice1ProductPageName)
      .should('be.visible');
    cy.go('back');
  });

  it('check for image widget', () => {
    cy.get(els.imageWidgetWithLink1)
      .should('be.visible')
      .click();
    cy.get(els.basicProductsCategoryTitle)
      .should('be.visible');
    cy.go('back');
  });

  it('check for product slider', () => {
    cy.get(els.productSliderProduct1)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.productWithLongDesciption4ProductPageName)
      .should('be.visible');
    cy.go('back');
  });

  it('check for category list', () => {
    cy.get(els.allProductCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.allProductsCategoryTitle)
      .should('be.visible');
    cy.go('back');
  });

  it('should check for product list grid', () => {
    cy.get(els.productGridWidgetSecondProduct)
      .should('be.visible')
      .scrollIntoView()
      .click();
    cy.get(els.productWithManyProps4ProductPagName)
      .should('be.visible');
    cy.go('back');
  });

  it('should check for product list', () => {
    cy.get(els.productListWidgetSecondProduct)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.productWithManyProps4ProductPagName)
      .should('be.visible');
  });
});
