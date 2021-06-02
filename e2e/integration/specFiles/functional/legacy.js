/* eslint-disable global-require */
import { goHomePage } from '../../../helper/navigation';
import els from '../../../elements/de';

describe('Functional test for legacy', () => {
  before(() => {
    goHomePage();

    cy.get(els.shopLogo).should('be.visible');
  });

  require('../../functional/StartPage.js');
  require('../../functional/CartPage.js');
  require('../../functional/CartPageCoupon.js');
  require('../../functional/CartPageOptions.js');
  require('../../functional/CategoryPage.js');
  require('../../functional/FavoritesPage.js');
  require('../../functional/FavoritesPageOptions.js');
  require('../../functional/FilterPage.js');
  require('../../functional/LoginPage.js');
  require('../../functional/ProductPage.js');
  require('../../functional/ProductPageOptions.js');
  require('../../functional/SearchPage.js');
});
/* eslint-enable global-require */

