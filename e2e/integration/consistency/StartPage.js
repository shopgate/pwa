import els from '../../elements/de';
import { goHomePage } from '../../helper/navigation';

describe('IOS11Test startPage', () => {
  before(goHomePage);

  afterEach(() => {
    cy.get(els.shopLogo).scrollIntoView();
  });

  it('should check tabBar entries', () => {
    cy.get(els.tabBarHome).should('be.visible');
    cy.get(els.tabBarBrowse).should('be.visible');
    cy.get(els.tabBarCart).should('be.visible');
    cy.get(els.tabBarFavorites).should('be.visible');
    cy.get(els.tabBarMore).should('be.visible');
  });

  it('should check for shop logo', () => {
    cy.get(els.shopLogo).should('be.visible');
  });

  it('should check for image slider widgets', () => {
    cy.get(els.imageSliderImage).should('have.length', 8)
  });

  it('should check for image widget', () => {
    cy.get(els.imageWidgetWithLink1)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for product slider', () => {
    cy.get(els.productSliderProduct1)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for live shopping', () => {
    cy.get(els.liveShoppingWidgetWithExpectedProduct)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for Product grid widget', () => {
    cy.get(els.productGridWidgetSecondProduct)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for product list widget', () => {
    cy.get(els.productListWidgetSecondProduct)
      .scrollIntoView()
      .should('be.visible');
  });

  it('should check for category list widget', () => {
    cy.get(els.categoryListWidgetFirstProduct)
      .scrollIntoView()
      .should('be.visible');
  });
});
