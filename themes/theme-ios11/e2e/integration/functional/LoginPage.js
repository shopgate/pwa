import els from '../../elements/de';
import { logOutUser } from '../../helper/user';
import { goMorePage } from '../../helper/navigation'

describe('functional tests login page', () => {
  before(goMorePage);

  after(logOutUser);

  it('should check for wrong credentials', () => {
    cy.get(els.userMenuLogin)
      .should('be.visible')
      .click();
    cy.get(els.loginPageEmailInput)
      .should('be.visible')
      .type('test1@test2.de');
    cy.get(els.loginPagePasswordInput)
      .type('testtest')
      .type('{enter}');
    cy.get(els.basicDialogText)
      .should('be.visible')
      .contains('Nutzername oder Passwort sind nicht korrekt');
    cy.get(els.basicDialogOkButton)
      .click();
  });

  it('should check for forgott password', () => {
    cy.get(els.forgotPasswordButton)
      .should('be.visible')
      .click();
    cy.get(els.basicDialogText)
      .should('be.visible')
      .contains('Bitte benutzen Sie die Desktop-Website, um Ihr Passwort zurückzusetzen.');
    cy.get(els.basicDialogOkButton)
      .should('be.visible')
      .click();
  });

  it('should check for correct credentials', () => {
    cy.get('@user').then((user) => {
      const userC = user;

      cy.spyAction('SUCCESS_LOGIN', () => {
        cy.get(els.loginPageEmailInput)
          .should('be.visible')
          .clear()
          .type(userC.username);
        cy.get(els.loginPagePasswordInput)
          .should('be.visible')
          .clear()
          .type(userC.password)
          .type('{enter}');
      });

      goMorePage();

      cy.get(els.loginWelcomeText)
        .should('be.visible')
        .contains('Hallo Dennis');
    });
  });
});
