import { hot } from 'react-hot-loader/root';
import React from 'react';
import PropTypes from 'prop-types';
import { ThemeConfigResolver } from '@shopgate/engage/core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { history } from '@shopgate/engage/core';
import routePortals from '@shopgate/pwa-common/helpers/portals/routePortals';
import { Route, Router } from '@shopgate/engage/components';
import ModalContainer from '@shopgate/pwa-common/components/ModalContainer';
import { ToastProvider, LoadingProvider } from '@shopgate/engage/core';
import App from '@shopgate/pwa-common/App';
import {
  INDEX_PATH,
  LOGIN_PATH,
  PAGE_PATTERN,
} from '@shopgate/engage/checkout';
import { CATEGORY_PATTERN, CATEGORY_FILTER_PATTERN } from '@shopgate/engage/category';
import {
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
} from '@shopgate/engage/product';
import { CART_PATH } from '@shopgate/engage/cart';
import { FAVORITES_PATH } from '@shopgate/engage/favorites';
import { MORE_PATH } from 'Pages/More/constants';
import { SEARCH_PATTERN, SEARCH_FILTER_PATTERN } from '@shopgate/engage/search';
import { SCANNER_PATH } from '@shopgate/engage/scanner';
import { NavigationHandler } from '@shopgate/engage/components';
import { Portal } from '@shopgate/engage/components';
import Toaster from '@shopgate/pwa-common/components/Toaster';
import { AppContext, ThemeContext } from '@shopgate/engage/core';
import { APP_GLOBALS } from '@shopgate/engage/core';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import SnackBar from 'Components/SnackBar';
import Viewport from 'Components/Viewport';
import Dialog from '@shopgate/pwa-ui-shared/Dialog';
import locale from '../locale';
import themeApi from '../themeApi';
import * as routes from './routes';

new ThemeConfigResolver().resolveAll();

/**
 * The theme's main component defines all the routes (views) inside the application.
 * @returns {JSX}
 */
const Pages = ({ store }) => (
  <App locale={locale} store={store}>
    <NavigationHandler>
      <AppContext.Provider value={appConfig}>
        <ThemeContext.Provider value={themeApi}>
          <LoadingProvider>
            <ToastProvider>
              <Portal name={APP_GLOBALS} />
              <Viewport>
                <ModalContainer component={Dialog} />
                <Toaster render={props => <SnackBar {...props} />} />
                <Router history={history}>
                  <Route pattern={INDEX_PATH} component={routes.StartPage} />
                  <Route pattern={PAGE_PATTERN} component={routes.Page} />
                  <Route pattern={CATEGORY_PATTERN} component={routes.Category} cache />
                  <Route pattern={CATEGORY_FILTER_PATTERN} component={routes.Filter} />
                  <Route pattern={ITEM_PATTERN} component={routes.Product} />
                  <Route pattern={ITEM_GALLERY_PATTERN} component={routes.ProductGallery} />
                  <Route pattern={ITEM_REVIEWS_PATTERN} component={routes.Reviews} />
                  <Route pattern={ITEM_WRITE_REVIEW_PATTERN} component={routes.WriteReview} />
                  <Route pattern={CART_PATH} component={routes.Cart} />
                  <Route pattern={BROWSE_PATH} component={routes.Browse} />
                  <Route pattern={MORE_PATH} component={routes.More} />
                  {
                    appConfig.hasFavorites
                    && <Route pattern={FAVORITES_PATH} component={routes.Favorites} />
                  }
                  <Route pattern={LOGIN_PATH} component={routes.Login} />
                  <Route pattern={SEARCH_PATTERN} component={routes.Search} cache />
                  <Route pattern={SEARCH_FILTER_PATTERN} component={routes.Filter} />
                  <Route pattern={SCANNER_PATH} component={routes.Scanner} />
                  {React.Children.map(routePortals, Component => Component)}
                </Router>
              </Viewport>
            </ToastProvider>
          </LoadingProvider>
        </ThemeContext.Provider>
      </AppContext.Provider>
    </NavigationHandler>
  </App>
);

Pages.propTypes = {
  store: PropTypes.shape().isRequired,
};

export default hot(Pages);
