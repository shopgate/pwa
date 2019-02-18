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
    cy.window().spyAction('RECEIVE_FAVORITES', () => {
      cy.get(els.favoriteButtonProductPage)
        .should('be.visible')
        .last()
        .click();
    });
    cy.get(els.navigatorButton)
      .first()
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
      .contains('Um dieses Produkt zum Warenkorb hinzuzufügen, wählen Sie bitte die Varianten.')
      .should('be.visible');
    cy.get(els.basicDialogOkButton)
      .contains('Abbrechen')
      .should('be.visible')
      .click();

    cy.wait(500);

    cy.get(els.addToCartButton).click();
    cy.get(els.basicDialogText)
      .contains('Um dieses Produkt zum Warenkorb hinzuzufügen, wählen Sie bitte die Varianten.')
      .should('be.visible');

    cy.window().spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.basicDialogOkButton)
        .contains('Varianten wählen')
        .click();
    });
    cy.get(els.variantPickerColor)
      .contains('Color auswählen')
      .should('be.visible');
    cy.get(els.variantPickerShoeSize)
      .contains('Shoe size auswählen')
      .should('be.visible');

    cy.window().spyAction('RECEIVE_FAVORITES', () => {
      cy.get(els.favoriteButtonProductPage).click();
    });
  });

  it('should check for empty fav list', () => {
    cy.visit('/favourite_list');
    cy.get(els.favoritesPageEmptyFavComponent).should('be.visible');
  });
});
