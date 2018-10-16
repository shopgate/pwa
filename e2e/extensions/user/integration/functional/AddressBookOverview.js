import els from './../../elements/de'
import { openNavDrawer, goBack } from '../../../../helper/navigation'
import { logInUser } from './../../../../helper/user'

describe('AddressBook overview', () => {

  before(() => {
    cy.visit('')
    logInUser()
  })

  it('shows address list page with add button', () => {
    openNavDrawer()

    cy.window().spyAction('UPDATE_HISTORY', () => {
      cy.get(els.userMenuAddressBook).should('be.visible').click()
    })

    cy.url().should('include', '/user/addresses')
    cy.get(els.addressListAddButton).should('be.visible')
  })

  it('navigate by address book', () => {
    cy.window().spyAction('OPEN_LINK', () => {
      cy.get(els.addressListAddButton).should('be.visible').click()
      cy.url().should('include', '/user/address/0')
      cy.get(els.userAddressBookAddPageBottomButton).should('be.disabled')
    })

    // Go back
    goBack()

    cy.url().should('include', '/user/addresses')
  })
})
