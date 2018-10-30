/// <reference types="Cypress" />

import els from '../../elements/de';
import { logOutUser } from '../../helper/user';

describe('AndroidGMDTest reviews page', () => {
  it('should check for review name', () => {
    logOutUser();

    cy.get(els.allProductCategory)
      .click();
    cy.get(els.productWithManyProps4GridViewName)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.writeReviewButton)
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

  it('should check for Review Title', () => {
    cy.get(els.writeReviewTitle)
      .should('be.visible');
  });

  it('should check for Review text area', () => {
    cy.get(els.writeReviewTextArea)
      .should('be.visible');
  });

  it('should check for reviewStars', () => {
    cy.get(els.writeReviewRatedStars)
      .should('be.visible');
  });

  it('should check for canel button', () => {
    cy.get(els.writeReviewCancelButton)
      .should('be.visible');
  });

  it('should check for send review button', () => {
    cy.get(els.writeReviewSendButton)
      .should('be.visible');
  });

  it('should check for back button', () => {
    cy.get(els.backButton)
      .should('be.visible');
    logOutUser();
  });
});

