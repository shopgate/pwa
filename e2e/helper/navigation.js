// eslint-disable-next-line import/named
import els, { navigatorButton, backButton, navigationDrawerBackdrop } from '../elements/de';

/**
 * Open the navDrawer
 */
export function openNavDrawer() {
  cy.get(navigatorButton)
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true });
}

/**
 * Close the navDrawer
 */
export function closeNavDrawer() {
  cy.get(navigationDrawerBackdrop).click({ force: true });
}

/**
 * Navigate by selector asserting current path
 * @param {string} path path
 * @param {string} selector selector
 */
function navigate(path, selector) {
  cy.wrap(new Promise((resolve) => {
    cy.location('pathname').then((pathName) => {
      if (!pathName) {
        return;
      }

      if (pathName === 'blank') {
        cy.task('log', 'Loading PWA');
        // First App load
        cy.visit('/');
        // eslint-disable-next-line no-param-reassign
        pathName = '/';
      }

      if (pathName !== path) {
        openNavDrawer();
        cy.spyAction(
          'ROUTE_DID_ENTER',
          () => cy.get(selector).scrollIntoView().click()
        ).then(resolve);
      } else {
        resolve();
      }
    });
  }));
}

/** Go home page */
export function goHomePage() {
  navigate('/', els.navDrawerStartPage);
}

/** Go categories page */
export function goCategoriesPage() {
  navigate('/category', els.navDrawerCategoriesButton);
}

/** Go cart page */
export function goCartPage() {
  navigate('/cart', els.navDrawerCartButton);
}

/** Go fav page */
export function goFavoritesPage() {
  navigate('/favorites', els.navDrawerFavoritesButton);
}

/** Go fav page */
export function goLoginPage() {
  navigate('/login', els.navigationDrawerLoginButton);
}

/**
 * Go Back navigation
 */
export function goBack() {
  cy.spyAction('ROUTE_DID_ENTER', () => {
    cy.get(backButton).last().should('be.visible').click();
  });
}
