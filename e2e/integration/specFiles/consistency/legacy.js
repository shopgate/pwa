import els from '../../../elements/de';
import { goHomePage } from '../../../helper/navigation';

/* eslint-disable global-require */
describe('Consistency test for legacy', () => {
  before(() => {
    goHomePage();

    cy.get(els.shopLogo).should('be.visible');
  });

  require('../../consistency/StartPage.js');
  require('../../consistency/CartPage.js');
  require('../../consistency/CartPageCoupon.js');
  require('../../consistency/CategoryPage.js');
  require('../../consistency/FavoritesPage.js');
  require('../../consistency/FilterPage.js');
  require('../../consistency/LoginPage.js');
  require('../../consistency/NavDrawer.js');
  require('../../consistency/ProductPage.js');
  require('../../consistency/ProductPageOptions.js');
  require('../../consistency/ProductPageBasePrice.js');
  require('../../consistency/ReviewsPage.js');
  require('../../consistency/SearchPage.js');
});
/* eslint-enable global-require */
