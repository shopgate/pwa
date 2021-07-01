// eslint-disable-next-line import/named
import els from '../elements/de';

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
  navigate('/', els.tabBarHome);
}

/** Go cart page */
export function goCartPage() {
  navigate('/cart', els.tabBarCart);
}

/** Go fav page */
export function goFavoritesPage() {
  navigate('/favourite_list', els.tabBarFavorites);
}

/** Go fav page */
export function goMorePage() {
  navigate('/more', els.tabBarMore);
}

/** Go fav page */
export function goBrowsePage() {
  navigate('/browse', els.tabBarBrowse);
}

/**
 * Go Back navigation
 */
export function goBack() {
  cy.spyAction('ROUTE_DID_ENTER', () => {
    cy.get(els.backButton).last().should('be.visible').click();
  });
}
