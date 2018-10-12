import { hot } from 'react-hot-loader';
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { isDev } from '@shopgate/pwa-common/helpers/environment';
import { history } from '@shopgate/pwa-common/helpers/router';
import routePortals from '@shopgate/pwa-common/helpers/portals/routePortals';
import Router from '@virtuous/react-conductor/Router';
import Route from '@virtuous/react-conductor/Route';
import ModalContainer from '@shopgate/pwa-common/components/ModalContainer';
import ToastProvider from '@shopgate/pwa-common/providers/toast';
import App from '@shopgate/pwa-common/App';
import { INDEX_PATH, LOGIN_PATH, PAGE_PATTERN } from '@shopgate/pwa-common/constants/RoutePaths';
import {
  ROOT_CATEGORY_PATTERN,
  CATEGORY_PATTERN,
  CATEGORY_FILTER_PATTERN,
} from '@shopgate/pwa-common-commerce/category/constants';
import {
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { SEARCH_PATTERN, SEARCH_FILTER_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
import Portal from '@shopgate/pwa-common/components/Portal';
import Toaster from '@shopgate/pwa-common/components/Toaster';
import SnackBar from '@shopgate/pwa-ui-material/SnackBar';
import { AppContext, ThemeContext } from '@shopgate/pwa-common/context';
import { APP_GLOBALS } from '@shopgate/pwa-common/constants/Portals';
import Viewport from 'Components/Viewport';
import View from 'Components/View';
import Dialog from '@shopgate/pwa-ui-shared/Dialog';
import locale from '../locale';
import * as routes from './routes';

const devFontsUrl = 'https://fonts.googleapis.com/css?family=Roboto:400,400i,500,700,900';

/**
 * The theme's main component defines all the routes (views) inside the application.
 * @returns {JSX}
 */
const Pages = ({ store }) => (
  <App locale={locale} store={store}>
    <AppContext.Provider value={{ ...appConfig }}>
      <ThemeContext.Provider value={{ View }}>
        <ToastProvider>
          <Portal name={APP_GLOBALS} />
          <Viewport>
            <ModalContainer component={Dialog} />
            <Toaster render={props => <SnackBar {...props} />} />
            <Router history={history}>
              <Route pattern={INDEX_PATH} component={routes.StartPage} />
              <Route pattern={PAGE_PATTERN} component={routes.Page} preload />
              <Route pattern={ROOT_CATEGORY_PATTERN} component={routes.RootCategory} />
              <Route pattern={CATEGORY_PATTERN} component={routes.Category} preload />
              <Route pattern={CATEGORY_FILTER_PATTERN} component={routes.Filter} />
              <Route pattern={ITEM_PATTERN} component={routes.Product} preload />
              <Route pattern={ITEM_GALLERY_PATTERN} component={routes.ProductGallery} />
              <Route pattern={ITEM_REVIEWS_PATTERN} component={routes.Reviews} />
              <Route pattern={ITEM_WRITE_REVIEW_PATTERN} component={routes.WriteReview} />
              <Route pattern={CART_PATH} component={routes.Cart} />
              {
                appConfig.hasFavorites
                && <Route pattern={FAVORITES_PATH} component={routes.Favorites} />
              }
              <Route pattern={LOGIN_PATH} component={routes.Login} />
              <Route pattern={SEARCH_PATTERN} component={routes.Search} preload />
              <Route pattern={SEARCH_FILTER_PATTERN} component={routes.Filter} />
              {React.Children.map(routePortals, Component => Component)}
            </Router>
            {isDev && (
              <Helmet>
                <link href={devFontsUrl} rel="stylesheet" />
              </Helmet>
            )}
          </Viewport>
        </ToastProvider>
      </ThemeContext.Provider>
    </AppContext.Provider>
  </App>
);

Pages.propTypes = {
  store: PropTypes.shape().isRequired,
};

export default hot(module)(Pages);
