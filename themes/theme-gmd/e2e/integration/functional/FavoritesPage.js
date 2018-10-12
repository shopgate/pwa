// / <reference types="Cypress" />

import els from '../../elements/de';

describe('e2e functional test favoritePage', () => {
  it('should add product with variants to favlist', () => {
    cy.visit('');

    cy.get(els.productVariantsCategory)
      .scrollIntoView()
      .click();
    cy.get(els.productsWith2VariantsCategory)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.productWithChild1MotherNameProductGrid)
      .should('be.visible')
      .last()
      .click();
    cy.get(els.favoriteButton)
      .should('be.visible')
      .last()
      .click();
    cy.go('back');
    cy.go('back');
    cy.go('back');
    cy.get(els.navigatorButton)
      .should('be.visible')
      .click()
      .wait(1000);
    cy.get(els.navDrawerFavoritesButton)
      .should('be.visible')
      .click();
    cy.get(els.addToCartButton)
      .should('be.visible')
      .click();
    cy.get(els.basicDialogText)
      .contains('Um dieses Produkt zum Warenkorb hinzuzufügen, wählen Sie bitte die Varianten.')
      .should('be.visible');
    cy.get(els.basicDialogOkButton)
      .contains('Abbrechen')
      .should('be.visible')
      .click()
      .wait(2000);
    cy.get(els.addToCartButton)
      .click();
    cy.get(els.basicDialogText)
      .contains('Um dieses Produkt zum Warenkorb hinzuzufügen, wählen Sie bitte die Varianten.')
      .should('be.visible');
    cy.get(els.basicDialogOkButton)
      .contains('Varianten wählen')
      .click();
    cy.get(els.variantPickerColor)
      .contains('Color auswählen')
      .should('be.visible');
    cy.get(els.variantPickerShoeSize)
      .contains('Shoe size auswählen')
      .should('be.visible');
    cy.reload()
      .wait(3000);
    cy.get(els.favoriteButton)
      .click()
      .wait(1000);
  });

  it('should check for empty fav list', () => {
    cy.visit('/favourite_list');
    cy.get(els.favoritesPageEmptyFavComponent)
      .should('be.visible');
  });

  it('should add product with options to favlist', () => {
    cy.visit('');

    cy.get(els.productWithOptionsCategory)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.get(els.simpleProductWithOptionsNameProductGrid)
      .should('be.visible')
      .click();
    cy.get(els.favoriteButton)
      .should('be.visible')
      .last()
      .click();
    cy.go('back');
    cy.go('back')
      .wait(2000);
    cy.get(els.navigatorButton)
      .should('be.visible')
      .click()
      .wait(1000);
    cy.get(els.navDrawerFavoritesButton)
      .should('be.visible')
      .click()
      .wait(3000);
    cy.get(els.favoriteButton)
      .should('be.visible')
      .last()
      .click();
  });
});
