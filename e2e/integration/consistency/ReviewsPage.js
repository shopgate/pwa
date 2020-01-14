import els from '../../elements/de';
import { logOutUser } from '../../helper/user';
import { goBrowsePage } from '../../helper/navigation'
import { navigateCategoryBySelector } from '../../helper/category'

describe('IOS11Test reviews page', () => {
  before(goBrowsePage);

  after(() => {
    cy.go('back');
    logOutUser();
  });

  it('should check for review name', () => {
    navigateCategoryBySelector(els.allProductCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithManyProps4GridViewName)
        .last()
        .scrollIntoView()
        .should('be.visible')
        .click();
    });

    cy.get(els.writeReviewButton)
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.get('@user').then((user) => {
      const userC = user;

      cy.get(els.loginPageEmailInput)
        .should('be.visible')
        .type(userC.username);
      cy.get(els.loginPagePasswordInput)
        .should('be.visible')
        .type(userC.password)
        .type('{enter}');

      cy.get(els.reviewsTitle, { timeout: 20000 })
        .should('be.visible');
    });

    cy.get(els.writeReviewName)
      .should('be.visible');
  });

  it('should check for title', () => {
    cy.get(els.writeReviewTitle)
      .should('be.visible');
  });

  it('should check for text area', () => {
    cy.get(els.writeReviewTextArea)
      .should('be.visible');
  });

  it('should check for reviewStars', () => {
    cy.get(els.writeReviewRatedStars)
      .should('be.visible');
  });

  it('should check for cancel button', () => {
    cy.get(els.writeReviewCancelButton)
      .should('be.visible');
  });

  it('should check for send review button', () => {
    cy.get(els.writeReviewSendButton)
      .should('be.visible');
  });

  it('should check for back button', () => {
    cy.get(els.backButton)
      .should('be.visible')
      .click();
  });
});
