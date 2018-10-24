import { userMenuAddressBook } from './../../elements/de'
import { openNavDrawer, closeNavDrawer } from '../../../../helper/navigation'
import { logInUser } from '../../../../helper/user'

describe('UserMenu', () => {
  it('AddressBook menu entry should present for logged in user', () => {
    cy.visit('')

    logInUser()

    openNavDrawer()
    cy.get(userMenuAddressBook).should('be.visible')
    closeNavDrawer()
  })
})
