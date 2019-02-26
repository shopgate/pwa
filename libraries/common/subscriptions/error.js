import {
  init,
  configureScope,
  captureException,
  captureMessage,
  withScope,
  addBreadcrumb,
  Severity,
} from '@sentry/browser';
import {
  // eslint-disable-next-line import/no-named-default
  default as appConfig,
  themeName,
  pckVersion,
} from '../helpers/config';
import { env } from '../helpers/environment';
import { historyPop } from '../actions/router';
import showModal from '../actions/modal/showModal';
import { getUserData } from '../selectors/user';
import { userDidUpdate$ } from '../streams/user';
import { routeDidEnter$ } from '../streams/router';
import { clientInformationDidUpdate$ } from '../streams/client';
import { appWillStart$, appDidStart$ } from '../streams/app';
import { appError$ } from '../streams/error';

/**
 * App errors subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default (subscribe) => {
  const { enabled, level, sampleRate } = appConfig.sentry;

  // Is not enabled
  if (!enabled) {
    return;
  }

  subscribe(appWillStart$, () => {
    init({
      dsn: 'https://1a444b262ac6405594ab33fb0102b377@sentry.io/1398210',
      environment: env,
      debug: env === 'development',
      release: pckVersion,
      attachStacktrace: true,
      sampleRate,
    });

    configureScope((scope) => {
      scope.setTag('marketId', appConfig.marketId);
      scope.setTag('appId', appConfig.appId);
      scope.setTag('pwaVersion', pckVersion);
      scope.setTag('theme', themeName);
      scope.setTag('language', appConfig.language);

      // Min log level
      scope.setLevel(Severity.fromString(level));
    });

    if (window) {
      window.onerror = (message, source, lineno, colno, error) => {
        captureException(error);
      };
    }
  });

  subscribe(userDidUpdate$, ({ getState }) => {
    const { id: userId } = getUserData(getState());
    configureScope((scope) => {
      scope.setTag('userId', userId);
    });
  });

  // Add client lib versions
  subscribe(clientInformationDidUpdate$, ({ action }) => {
    const { appVersion, libVersion, deviceId } = action.data;
    configureScope((scope) => {
      scope.setTag('appVersion', appVersion);
      scope.setTag('libVersion', libVersion);
      scope.setTag('deviceId', deviceId);
    });
  });

  // Add app start event for debugging
  subscribe(appDidStart$, () => {
    captureMessage('App did start', Severity.Debug);
  });

  // Add breadcrumbs to sentry
  subscribe(routeDidEnter$, ({ action }) => {
    const { pattern } = action.route;
    addBreadcrumb({
      category: pattern,
    });
  });

  // Add some stack trace and log to sentry
  subscribe(appError$, ({ dispatch, action }) => {
    withScope((scope) => {
      if (action.error.stack) {
        scope.setExtra('stack', action.error.stack);
      }
      captureException(action.error);
    });

    // Show modal to user
    dispatch(showModal({
      confirm: null,
      message: 'modal.body_error',
      title: 'modal.title_error',
    }));

    // Go back 1
    dispatch(historyPop());
  });
};
