import { hot } from 'react-hot-loader/root';
import 'Extensions/portals';
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { ThemeConfigResolver, AppProvider, hasWebBridge } from '@shopgate/engage/core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { isDev } from '@shopgate/pwa-common/helpers/environment';
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
import {
  ROOT_CATEGORY_PATTERN,
  CATEGORY_PATTERN,
  CATEGORY_ALL_PATTERN,
  CATEGORY_FILTER_PATTERN,
  CATEGORY_ALL_FILTER_PATTERN,
} from '@shopgate/engage/category/constants';
import {
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';
import { SCANNER_PATH } from '@shopgate/pwa-common-commerce/scanner/constants';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { transformRoute as transformItemRoute } from '@shopgate/engage/product';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { SEARCH_PATTERN, SEARCH_FILTER_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
import {
  NavigationHandler,
  BrandingColorBanner,
  SideNavigation,
} from '@shopgate/engage/components';
import Portal from '@shopgate/pwa-common/components/Portal';
import Toaster from '@shopgate/pwa-common/components/Toaster';
import { ThemeContext } from '@shopgate/pwa-common/context';
import { APP_GLOBALS } from '@shopgate/pwa-common/constants/Portals';
import { STORE_FINDER_PATTERN, GlobalLocationSelector } from '@shopgate/engage/locations';
import FavoritesListChooser from '@shopgate/engage/favorites/components/ListChooser';

import { FulfillmentSlotProvider } from '@shopgate/engage/locations/components/FulfillmentSlotSwitcher';
import SnackBar from 'Components/SnackBar';
import Viewport from 'Components/Viewport';
import Dialog from '@shopgate/pwa-ui-shared/Dialog';
import { PushOptInModal } from '@shopgate/engage/push-opt-in/components';
import { BACK_IN_STOCK_PATTERN } from '@shopgate/engage/back-in-stock/constants';
import {
  CHECKOUT_PATTERN,
  GUEST_CHECKOUT_PATTERN,
  GUEST_CHECKOUT_PAYMENT_PATTERN,
  CHECKOUT_CONFIRMATION_PATTERN,
  CHECKOUT_ADDRESS_BOOK_PATTERN,
  CHECKOUT_ADDRESS_BOOK_CONTACT_PATTERN,
} from '@shopgate/engage/checkout/constants';
import { FORGOT_PASSWORD_PATTERN } from '@shopgate/engage/login';
import { ACCOUNT_PATH, ACCOUNT_PATTERN, PROFILE_ADDRESS_PATH } from '@shopgate/engage/account';
import { ORDER_DETAILS_PATTERN, ORDER_DETAILS_PRIVATE_PATTERN } from '@shopgate/engage/orders';
import CheckoutConfirmationPage from './Checkout/CheckoutConfirmation';
import ForgotPassword from './ForgotPassword';
import OrderDetails from './OrderDetails';
import Account from './Account';
import AccountContact from './Account/Contact';
import StoreFinder from './StoreFinder';
import PageNotFound from './404';
import * as routes from './routes';
import { routesTransforms } from './routesTransforms';
import themeApi from '../themeApi';
import { navigation, navigationHidden, content } from './index.style';

const devFontsUrl = 'https://connect.shopgate.com/assets/fonts/roboto/font.css';

new ThemeConfigResolver().resolveAll();

const sideNavigationBlacklist = [
  CHECKOUT_PATTERN,
  GUEST_CHECKOUT_PATTERN,
  GUEST_CHECKOUT_PAYMENT_PATTERN,
  CHECKOUT_CONFIRMATION_PATTERN,
  ORDER_DETAILS_PATTERN,
  CHECKOUT_ADDRESS_BOOK_PATTERN,
  CHECKOUT_ADDRESS_BOOK_CONTACT_PATTERN,
];

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
 * @returns {JSX.Element}
 */
const Pages = ({ store }) => {
  const { enabled: recaptchaEnabled, googleCloudSiteKey } = appConfig?.recaptcha;

  return (
    <App store={store}>
      <Helmet>
        <html lang={appConfig.language.substring(0, 2)} className="theme-gmd" />
        {recaptchaEnabled && googleCloudSiteKey ? (
          <script src={`https://www.google.com/recaptcha/enterprise.js?render=${googleCloudSiteKey}`} />
        ) : null }
        <style type="text/css">
          {`
            .grecaptcha-badge { display:none; }
          `}
        </style>
      </Helmet>
      <NavigationHandler>
        <AppProvider>
          <ThemeContext.Provider value={themeApi}>
            <LoadingProvider>
              <ToastProvider>
                <Portal name={APP_GLOBALS} />
                <BrandingColorBanner />
                <Viewport>
                  <ModalContainer component={Dialog} />
                  <PushOptInModal />
                  <Toaster render={props => <SnackBar {...props} />} />
                  <FavoritesListChooser />
                  <FulfillmentSlotProvider />
                  <GlobalLocationSelector routePatternAllowList={globalLocationSelectorAllowList} />
                  <SideNavigation
                    classNames={{
                      visible: navigation,
                      hidden: navigationHidden,
                    }}
                    routePatternBlacklist={sideNavigationBlacklist}
                  />
                  <div className={content}>
                    <Router history={history}>
                      <Route
                        pattern={INDEX_PATH}
                        component={routes.StartPage}
                        transform={routesTransforms[INDEX_PATH]}
                      />
                      <Route pattern={PAGE_PATTERN} component={routes.Page} />
                      <Route
                        pattern={ROOT_CATEGORY_PATTERN}
                        component={routes.RootCategory}
                        cache
                        transform={routesTransforms[ROOT_CATEGORY_PATTERN]}
                      />
                      <Route pattern={CATEGORY_PATTERN} component={routes.Category} cache />
                      <Route pattern={CATEGORY_FILTER_PATTERN} component={routes.Filter} />
                      <Route pattern={CATEGORY_ALL_PATTERN} component={routes.Search} />
                      <Route pattern={CATEGORY_ALL_FILTER_PATTERN} component={routes.Filter} />
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
                      <Route pattern={SCANNER_PATH} component={routes.Scanner} />
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
                      <Route
                        pattern={BACK_IN_STOCK_PATTERN}
                        component={routes.BackInStock}
                      />
                      <Route
                        pattern={CHECKOUT_PATTERN}
                        component={routes.Checkout}
                      />
                      <Route
                        pattern={GUEST_CHECKOUT_PATTERN}
                        component={routes.GuestCheckoutRegistration}
                      />
                      <Route
                        pattern={GUEST_CHECKOUT_PAYMENT_PATTERN}
                        component={routes.GuestCheckoutPayment}
                      />
                      <Route
                        pattern={CHECKOUT_CONFIRMATION_PATTERN}
                        component={CheckoutConfirmationPage}
                      />
                      <Route
                        pattern={CHECKOUT_ADDRESS_BOOK_PATTERN}
                        component={routes.CheckoutAddressBook}
                      />
                      <Route
                        pattern={CHECKOUT_ADDRESS_BOOK_CONTACT_PATTERN}
                        component={routes.CheckoutAddressBookContact}
                      />
                      <Route
                        pattern={REGISTER_PATH}
                        component={routes.Register}
                      />
                      <Route
                        pattern={FORGOT_PASSWORD_PATTERN}
                        component={ForgotPassword}
                      />
                      <Route
                        pattern={ACCOUNT_PATH}
                        component={Account}
                      />
                      <Route
                        pattern={ACCOUNT_PATTERN}
                        component={Account}
                      />
                      <Route
                        pattern={PROFILE_ADDRESS_PATH}
                        component={AccountContact}
                      />
                      <Route
                        pattern={ORDER_DETAILS_PATTERN}
                        component={OrderDetails}
                      />
                      <Route
                        pattern={ORDER_DETAILS_PRIVATE_PATTERN}
                        component={OrderDetails}
                      />
                      <Route
                        pattern={STORE_FINDER_PATTERN}
                        component={StoreFinder}
                      />
                      <Route.NotFound component={PageNotFound} />
                      {React.Children.map(routePortals, Component => Component)}
                    </Router>
                  </div>

                  {(isDev || hasWebBridge()) && (
                    <Helmet>
                      <link href={devFontsUrl} rel="stylesheet" />
                    </Helmet>
                  )}
                </Viewport>
              </ToastProvider>
            </LoadingProvider>
          </ThemeContext.Provider>
        </AppProvider>
      </NavigationHandler>
    </App>
  );
};

Pages.propTypes = {
  store: PropTypes.shape().isRequired,
};

export default hot(Pages);
