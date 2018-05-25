import { hot } from 'react-hot-loader';
import React from 'react';
import Helmet from 'react-helmet';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { isDev } from '@shopgate/pwa-common/helpers/environment';
import Router from '@virtuous/react-conductor/Router';
import Route from '@virtuous/react-conductor/Route';
import ModalContainer from '@shopgate/pwa-common/components/ModalContainer';
import App from '@shopgate/pwa-common/App';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
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
import Worker from './worker';
import * as routes from './routes';

const devFontsUrl = 'https://fonts.googleapis.com/css?family=Roboto:400,400i,500,700,900';

/**
 * The theme's main component defines all the routes (views) inside the application.
 * @returns {JSX}
 */
const Pages = () => (
  <App locale={locale} reducers={reducers} subscribers={subscribers} Worker={Worker}>
    <AppContext.Provider value={{ ...appConfig }}>
      <ThemeContext.Provider value={{}}>
        <Portal name={APP_GLOBALS} />
        <Viewport>
          <ModalContainer component={Dialog} />
          <SnackBar />
          <Router>
            <Route pattern={`${INDEX_PATH}`} component={routes.Page} />
            <Route pattern={`${CATEGORY_PATH}`} component={routes.RootCategory} />
          </Router>
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
