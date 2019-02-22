import els from '../../elements/de';
import { navigateCategoryBySelector } from '../../helper/category';

describe('e2e functional test favoritePage', () => {
  it('should add product with variants to favlist', () => {
    cy.visit('');

    navigateCategoryBySelector(els.productVariantsCategory);
    navigateCategoryBySelector(els.productsWith2VariantsCategory);

    cy.window().spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.productWithChild1MotherNameProductGrid)
        .should('be.visible')
        .last()
        .click();
    });
    cy.window().spyAction('RECEIVE_FAVORITES', () => {
      cy.get(els.favoriteButtonProductPage)
        .should('be.visible')
        .last()
        .click();
    });
    cy.get(els.navigatorButton)
      .last()
      .should('be.visible')
      .click()
      .wait(200);

    cy.window().spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.navDrawerFavoritesButton)
        .should('be.visible')
        .click();
    });
    cy.get(els.addToCartButton)
      .should('be.visible')
      .click();
    cy.get(els.basicDialogText)
      .should('be.visible')
      .contains('Um dieses Produkt zum Warenkorb hinzuzufügen, wählen Sie bitte die Varianten.');
    cy.get(els.basicDialogOkButton)
      .should('be.visible')
      .contains('Abbrechen')
      .click()
      .wait(500);

    cy.get(els.addToCartButton)
      .should('be.visible')
      .click();
    cy.get(els.basicDialogText)
      .should('be.visible')
      .contains('Um dieses Produkt zum Warenkorb hinzuzufügen, wählen Sie bitte die Varianten.');

    cy.window().spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.basicDialogOkButton)
        .should('be.visible')
        .contains('Varianten wählen')
        .click();
    });
    cy.get(els.variantPickerColor)
      .should('be.visible')
      .contains('Color auswählen');
    cy.get(els.variantPickerShoeSize)
      .should('be.visible')
      .contains('Shoe size auswählen');

    cy.window().spyAction('RECEIVE_FAVORITES', () => {
      cy.get(els.favoriteButtonProductPage)
        .last()
        .should('be.visible')
        .click();
    });
  });

  it('should check for empty fav list', () => {
    cy.get(els.navigatorButton)
      .last()
      .should('be.visible')
      .click()
      .wait(200);

    cy.window().spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.navDrawerFavoritesButton)
        .should('be.visible')
        .click();
    });
    cy.get(els.favoritesPageEmptyFavComponent).should('be.visible');
  });
});
