import els from '../../elements/de';
import { navigateCategoryBySelector } from '../../helper/category';
import { goCategoriesPage, goFavoritesPage } from '../../helper/navigation';

describe('e2e functional test favoritePage', () => {
  before(goCategoriesPage);

  it('should add product with variants to favlist', () => {
    navigateCategoryBySelector(els.productVariantsCategory);
    navigateCategoryBySelector(els.productsWith2VariantsCategory);

    cy.spyAction('RECEIVE_PRODUCT_CACHED', () => {
      cy.get(els.visiblePage).within(() => {
        cy.get(els.productWithChild1MotherNameProductGrid)
          .should('be.visible')
          .last()
          .click();
      });
    });

    cy.spyAction('RECEIVE_FAVORITES', () => {
      cy.get(els.favoriteButtonProductPage)
        .should('be.visible')
        .last()
        .click();
    });

    goFavoritesPage();

    cy.get(els.visiblePage).within(() => {
      cy.get(els.addToCartButton)
        .should('be.visible')
        .click();
    });

    cy.get(els.basicDialogText)
      .should('be.visible')
      .contains('Um dieses Produkt zum Warenkorb hinzuzufügen, wählen Sie bitte die Varianten.');
    cy.get(els.basicDialogOkButton)
      .should('be.visible')
      .contains('Abbrechen')
      .click()
      .wait(500);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.addToCartButton)
        .should('be.visible')
        .click();
    });

    cy.spyAction('RECEIVE_PRODUCT_CACHED', () => {
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
  });

  it('should check for empty fav list', () => {
    cy.spyAction('RECEIVE_FAVORITES', () => {
      cy.get(els.favoriteButtonProductPage)
        .last()
        .should('be.visible')
        .click();
    });

    goFavoritesPage();

    cy.get(els.favoritesPageEmptyFavComponent).should('be.visible');
  });
});
