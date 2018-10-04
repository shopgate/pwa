import React from 'react';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { isDev } from '@shopgate/pwa-common/helpers/environment';
import Route from '@shopgate/pwa-common/components/Router/components/Route';
import AuthRoutes from '@shopgate/pwa-common/components/Router/components/AuthRoutes';
import ModalContainer from '@shopgate/pwa-common/components/ModalContainer';
import App from '@shopgate/pwa-common/App';
import {
  INDEX_PATH,
  PAGE_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
  CHECKOUT_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { ORDERS_PATH } from '@shopgate/pwa-common-commerce/orders/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import Portal from '@shopgate/pwa-common/components/Portal';
import { AppContext, ThemeContext } from '@shopgate/pwa-common/context';
import { APP_ROUTES, APP_GLOBALS } from '@shopgate/pwa-common/constants/Portals';
import Viewport from 'Components/Viewport';
import View from 'Components/View';
import Dialog from '@shopgate/pwa-ui-shared/Dialog';
import SnackBar from 'Components/SnackBar';
import locale from '../locale';
import reducers from './reducers';
import subscribers from './subscribers';
import * as routes from './routes';

const devFontsUrl = 'https://fonts.googleapis.com/css?family=Roboto:400,400i,500,700,900';

/**
 * The theme's main component defines all the routes (views) inside the application.
 * @returns {JSX}
 */
const Pages = () => (
  <App locale={locale} reducers={reducers} subscribers={subscribers}>
    <AppContext.Provider value={{ ...appConfig }}>
      <ThemeContext.Provider value={{}}>
        <Portal name={APP_GLOBALS} />
        <Viewport>
          <ModalContainer component={Dialog} />
          <SnackBar />
          <Route path={`${INDEX_PATH}`} component={routes.Page} />
          <Route path={`${PAGE_PATH}/:pageId`} component={routes.Page} />
          <Route path={`${CATEGORY_PATH}`} component={routes.Category} />
          <Route path={`${CATEGORY_PATH}/:categoryId?/:selection?`} component={routes.Category} />
          <Route path={`${FILTER_PATH}`} component={routes.Filter} />
          <Route path={`${FILTER_PATH}/:attribute`} component={routes.FilterAttribute} />
          <Route path={`${ITEM_PATH}/:productId`} component={routes.Product} />
          <Route path={`${ITEM_PATH}/:productId/gallery/:initialSlide?`} component={routes.ProductGallery} />
          <Route path={`${ITEM_PATH}/:productId/reviews/`} component={routes.Reviews} />
          <Route path={`${CART_PATH}`} component={routes.Cart} />
          {
            appConfig.hasFavorites
            && <Route path={`${FAVORITES_PATH}`} component={routes.Favorites} />
          }
          <Route path={`${SEARCH_PATH}`} component={routes.Search} />
          <Route path={`${LOGIN_PATH}`} component={routes.Login} />
          <Route path={`${REGISTER_PATH}`} component={routes.Register} />

          <AuthRoutes to={`${LOGIN_PATH}`}>
            <Route path={`${CHECKOUT_PATH}`} component={routes.Checkout} />
            <Route path={`${ORDERS_PATH}`} component={routes.Orders} />
            <Route path={`${ITEM_PATH}/:productId/write_review/`} component={routes.WriteReview} />
          </AuthRoutes>

          <Portal name={APP_ROUTES} props={{ View }} />

          {isDev && (
            <Helmet>
              <link href={devFontsUrl} rel="stylesheet" />
            </Helmet>
          )}
        </Viewport>
      </ThemeContext.Provider>
    </AppContext.Provider>
  </App>
);

export default hot(module)(Pages);
