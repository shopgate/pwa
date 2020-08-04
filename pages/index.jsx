import { hot } from 'react-hot-loader/root';
import 'Extensions/portals';
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { ThemeConfigResolver, AppProvider } from '@shopgate/engage/core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { history } from '@shopgate/pwa-common/helpers/router';
import routePortals from '@shopgate/pwa-common/helpers/portals/routePortals';
import { Route, Router } from '@shopgate/pwa-common/components';
import ModalContainer from '@shopgate/pwa-common/components/ModalContainer';
import { ToastProvider, LoadingProvider } from '@shopgate/pwa-common/providers';
import App from '@shopgate/pwa-common/App';
import {
  INDEX_PATH,
  LOGIN_PATH,
  PAGE_PATTERN,
  REGISTER_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import { CATEGORY_PATTERN, CATEGORY_FILTER_PATTERN } from '@shopgate/pwa-common-commerce/category/constants';
import {
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';
import {
  CHECKOUT_PATTERN,
  GUEST_CHECKOUT_PATTERN,
  CHECKOUT_CONFIRMATION_PATTERN,
  GUEST_CHECKOUT_PAYMENT_PATTERN,
  CHECKOUT_BILLING_PATTERN,
} from '@shopgate/engage/checkout/constants';
import { FORGOT_PASSWORD_PATTERN } from '@shopgate/engage/login';
import { ORDER_DETAILS_PATTERN } from '@shopgate/engage/orders';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { transformRoute as transformItemRoute } from '@shopgate/engage/product';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { MORE_PATH } from 'Pages/More/constants';
import { SEARCH_PATTERN, SEARCH_FILTER_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
import { SCANNER_PATH } from '@shopgate/pwa-common-commerce/scanner/constants';
import { NavigationHandler } from '@shopgate/engage/components';
import Portal from '@shopgate/pwa-common/components/Portal';
import Toaster from '@shopgate/pwa-common/components/Toaster';
import { ThemeContext } from '@shopgate/pwa-common/context';
import { APP_GLOBALS } from '@shopgate/pwa-common/constants/Portals';
import { STORE_FINDER_PATTERN, GlobalLocationSelector } from '@shopgate/engage/locations';
import FavoritesListChooser from '@shopgate/engage/favorites/components/ListChooser';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import SnackBar from 'Components/SnackBar';
import Viewport from 'Components/Viewport';
import Dialog from '@shopgate/pwa-ui-shared/Dialog';
import CheckoutPage from './Checkout/Checkout';
import GuestCheckoutPage from './Checkout/GuestCheckout';
import GuestCheckoutPaymentPage from './Checkout/GuestCheckoutPayment';
import CheckoutConfirmationPage from './Checkout/CheckoutConfirmation';
import CheckoutBillingChange from './Checkout/CheckoutBillingChange';
import ForgotPassword from './ForgotPassword';
import Register from './Register';
import OrderDetails from './OrderDetails';
import StoreFinder from './StoreFinder';
import themeApi from '../themeApi';
import * as routes from './routes';
import { routesTransforms } from './routesTransforms';

new ThemeConfigResolver().resolveAll();

const globalLocationSelectorAllowList = [
  INDEX_PATH,
  CATEGORY_PATTERN,
  SEARCH_PATTERN,
  PAGE_PATTERN,
  ITEM_PATTERN,
  CART_PATH,
];

/**
 * The theme's main component defines all the routes (views) inside the application.
 * @returns {JSX}
 */
const Pages = ({ store }) => (
  <App store={store}>
    <Helmet>
      <html lang={appConfig.language.substring(0, 2)} />
    </Helmet>
    <NavigationHandler>
      <AppProvider>
        <ThemeContext.Provider value={themeApi}>
          <LoadingProvider>
            <ToastProvider>
              <Portal name={APP_GLOBALS} />
              <Viewport>
                <ModalContainer component={Dialog} />
                <Toaster render={props => <SnackBar {...props} />} />
                <FavoritesListChooser />
                <GlobalLocationSelector routePatternAllowList={globalLocationSelectorAllowList} />
                <Router history={history}>
                  <Route
                    pattern={INDEX_PATH}
                    component={routes.StartPage}
                    transform={routesTransforms[INDEX_PATH]}
                  />
                  <Route pattern={PAGE_PATTERN} component={routes.Page} />
                  <Route pattern={CATEGORY_PATTERN} component={routes.Category} cache />
                  <Route pattern={CATEGORY_FILTER_PATTERN} component={routes.Filter} />
                  <Route
                    pattern={ITEM_PATTERN}
                    component={routes.Product}
                    transform={transformItemRoute}
                  />
                  <Route pattern={ITEM_GALLERY_PATTERN} component={routes.ProductGallery} />
                  <Route pattern={ITEM_REVIEWS_PATTERN} component={routes.Reviews} />
                  <Route pattern={ITEM_WRITE_REVIEW_PATTERN} component={routes.WriteReview} />
                  <Route
                    pattern={CART_PATH}
                    component={routes.Cart}
                    transform={routesTransforms[CART_PATH]}
                  />
                  <Route
                    pattern={BROWSE_PATH}
                    component={routes.Browse}
                    transform={routesTransforms[BROWSE_PATH]}
                  />
                  <Route
                    pattern={MORE_PATH}
                    component={routes.More}
                    transform={routesTransforms[MORE_PATH]}
                  />
                  {
                    appConfig.hasFavorites
                    && <Route
                      pattern={FAVORITES_PATH}
                      component={routes.Favorites}
                      transform={routesTransforms[FAVORITES_PATH]}
                    />
                  }
                  <Route pattern={LOGIN_PATH} component={routes.Login} />
                  <Route
                    pattern={SEARCH_PATTERN}
                    component={routes.Search}
                    cache
                    transform={routesTransforms[SEARCH_PATTERN]}
                  />
                  <Route
                    pattern={SEARCH_FILTER_PATTERN}
                    component={routes.Filter}
                    transform={routesTransforms[SEARCH_FILTER_PATTERN]}
                  />
                  <Route pattern={SCANNER_PATH} component={routes.Scanner} />
                  <Route
                    pattern={CHECKOUT_PATTERN}
                    component={CheckoutPage}
                  />
                  <Route
                    pattern={GUEST_CHECKOUT_PATTERN}
                    component={GuestCheckoutPage}
                  />
                  <Route
                    pattern={GUEST_CHECKOUT_PAYMENT_PATTERN}
                    component={GuestCheckoutPaymentPage}
                  />
                  <Route
                    pattern={CHECKOUT_CONFIRMATION_PATTERN}
                    component={CheckoutConfirmationPage}
                  />
                  <Route
                    pattern={CHECKOUT_BILLING_PATTERN}
                    component={CheckoutBillingChange}
                  />
                  <Route
                    pattern={REGISTER_PATH}
                    component={Register}
                  />
                  <Route
                    pattern={FORGOT_PASSWORD_PATTERN}
                    component={ForgotPassword}
                  />
                  <Route
                    pattern={ORDER_DETAILS_PATTERN}
                    component={OrderDetails}
                  />
                  <Route
                    pattern={STORE_FINDER_PATTERN}
                    component={StoreFinder}
                  />
                  {React.Children.map(routePortals, Component => Component)}
                </Router>
              </Viewport>
            </ToastProvider>
          </LoadingProvider>
        </ThemeContext.Provider>
      </AppProvider>
    </NavigationHandler>
  </App>
);

Pages.propTypes = {
  store: PropTypes.shape().isRequired,
};

export default hot(Pages);
