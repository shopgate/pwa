import els from '../../elements/de';
import { closeNavDrawer, goHomePage } from '../../helper/navigation';

describe('AndroidGMDTest navDrawer', () => {
  before(goHomePage);
  after(closeNavDrawer);

  it('should check for login button', () => {
    cy.get(els.navigatorButton)
      .should('be.visible')
      .click();
    cy.get(els.navigationDrawerLoginButton)
      .should('be.visible');
  });

  it('should check for startpage entry', () => {
    cy.get(els.navDrawerStartPage)
      .should('be.visible');
  });

  it('should check for categories entry', () => {
    cy.get(els.navDrawerCategoriesButton)
      .should('be.visible');
  });

  it('should check for favorites entry', () => {
    cy.get(els.navDrawerFavoritesButton)
      .should('be.visible');
  });

  it('should check for cart entry', () => {
    cy.get(els.navDrawerCartButton)
      .should('be.visible');
  });

  it('should check for shipping entry', () => {
    cy.get(els.navDrawerShippingButton)
      .should('be.visible');
  });

  it('should check for payment entry', () => {
    cy.get(els.navDrawerPaymentButton)
      .should('be.visible');
  });

  it('should check for terms entry', () => {
    cy.get(els.navDrawerTermsButton)
      .should('be.visible');
  });

  it('should check for privacy entry', () => {
    cy.get(els.navDrawerPrivacyButton)
      .should('be.visible');
  });

  it('should check for return policy entry', () => {
    cy.get(els.navDrawerReturnPolicy)
      .should('be.visible');
  });

  it('should check for imprint', () => {
    cy.get(els.navDrawerImprintButton)
      .should('be.visible');
  });
});
