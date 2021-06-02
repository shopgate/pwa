import els from '../../elements/de';
import { navigateCategoryBySelector } from '../../helper/category';
import { goBrowsePage, goFavoritesPage } from '../../helper/navigation'

describe('e2e functional test favoritePage', () => {
  before(goBrowsePage);

  it('should add product with variants to favlist', () => {
    navigateCategoryBySelector(els.productVariantsCategory);
    navigateCategoryBySelector(els.productsWith2VariantsCategory);

    cy.get(els.visiblePage).within(() => {
      cy.get(els.productWithChild1MotherNameProductGrid)
        .should('be.visible')
        .last()
        .click();
    });
    cy.get(els.visiblePage).within(() => {
      cy.spyAction('SUCCESS_ADD_FAVORITES', () => {
        cy.get(els.favoriteButtonItemPage)
          .should('be.visible')
          .last()
          .click();
      });
    });

    cy.go('back');

    goFavoritesPage();

    cy.get(els.visiblePage).within(() => {
      cy.get(els.addToCartButton)
        .should('be.visible')
        .click()
        .wait(100);
    });

    cy.get(els.basicDialogText)
      .contains('Um dieses Produkt zum Warenkorb hinzuzufügen, wählen Sie bitte die Varianten.')
      .should('be.visible');
    cy.get(els.basicDialogOkButton)
      .contains('Abbrechen')
      .should('be.visible')
      .click()
      .wait(100);

    cy.get(els.visiblePage).within(() => cy.get(els.addToCartButton).click().wait(100));

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

    cy.spyAction('SUCCESS_REMOVE_FAVORITES', () => {
      cy.get(els.visiblePage).within(() => {
        cy.get(els.favoriteButtonItemPage).click();
      });
    });

    cy.go('back');
  });

  it('should check for empty fav list', () => {
    goFavoritesPage();
    cy.get(els.favoritesPageEmptyFavComponent)
      .should('be.visible');
  });
});
