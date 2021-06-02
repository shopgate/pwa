import els from './../../elements/de';
import { openNavDrawer } from '../../../../helper/navigation';
import { logInUser } from './../../../../helper/user';
import { setValue, selectValue } from './../../../../helper/form';
import addressFixtures from './../../fixtures/address';

describe('AddressBook Address details', () => {
  before(() => {
    cy.visit('');
    logInUser();
  });

  it('should add a new address', () => {
    openNavDrawer();

    cy.window().spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.userMenuAddressBook).should('be.visible').click();
    });

    cy.window().spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.addressListAddButton).should('be.visible').click();
    });

    cy.get(els.userAddressBookAddPageForm).within(() => {
      setValue('input[name="address.firstName"]', addressFixtures.firstName);
      setValue('input[name="address.lastName"]', addressFixtures.lastName);
      setValue('input[name="address.street1"]', addressFixtures.street1);
      setValue('input[name="address.zipCode"]', addressFixtures.zipCode);
      setValue('input[name="address.city"]', addressFixtures.city);
      selectValue('select[name="address.country"]', addressFixtures.country);
    });

    cy.window().spyAction('USER_ADDRESSES_RECEIVED', () => {
      cy.get(els.userAddressBookAddPageBottomButton)
        .should('be.enabled')
        .click();
    }).then(({ addresses: [{ id }] }) => id)
      .should('be.ok')
      .as('userAddressId');

    cy.url()
      .should('include', '/user/addresses');

    cy.get('@userAddressId').then((id) => {
      cy.get(els.addressListPageAddress(id)).should('be.visible');
    });

    // Delete address
    cy.window().spyAction('ROUTE_DID_ENTER', () => {
      cy.get('@userAddressId').then((id) => {
        cy.get(els.addressListPageAddress(id)).should('be.visible').click();
      });
    });

    cy.window().spyAction('CREATE_MODAL', () => {
      cy.get(els.userAddressBookAddPageBottomButton)
        .should('be.visible').click();
    }).its('options.confirm').should('contain', 'address.delete.button');

    cy.window().spyAction('ROUTE_DID_ENTER', () => {
      cy.get(els.modal).within(() => {
        cy.contains('Löschen').should('be.visible').click();
      });
    });

    cy.url().should('include', '/user/addresses');
    cy.get('@userAddressId').then((id) => {
      cy.get(els.addressListPageAddress(id)).should('not.exist');
    });
  });
});
