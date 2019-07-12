import {
  init,
  configureScope,
  captureException,
  captureMessage,
  withScope,
  Severity as SentrySeverity,
} from '@sentry/browser';
import { emitter } from '@shopgate/pwa-core';
import { SOURCE_TRACKING, Severity } from '@shopgate/pwa-core/constants/ErrorManager';
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
import { clientInformationDidUpdate$ } from '../streams/client';
import { appWillStart$, appDidStart$ } from '../streams/app';
import { appError$ } from '../streams/error';
import { getRouterStack } from '../selectors/router';

/**
 * App errors subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default (subscribe) => {
  // This subscription is always active despite sentry activation
  subscribe(appError$, ({ dispatch }) => {
    // Show modal to user
    dispatch(showModal({
      confirm: null,
      message: 'modal.body_error',
      title: 'modal.title_error',
    }));
    dispatch(historyPop());
  });

  const { enabled, level, sampleRate } = appConfig.sentry;
  // Is not enabled
  if (!enabled) {
    return;
  }

  const severityMap = {
    [Severity.Fatal]: SentrySeverity.Fatal,
    [Severity.Error]: SentrySeverity.Error,
    [Severity.Critical]: SentrySeverity.Critical,
    [Severity.Warning]: SentrySeverity.Warning,
    [Severity.Info]: SentrySeverity.Info,
    [Severity.Debug]: SentrySeverity.Debug,
  };

  let trackedSeverities = Object.getOwnPropertySymbols(severityMap).map(s => severityMap[s]);
  const minSeverityIndex = trackedSeverities.indexOf(level);
  if (minSeverityIndex > -1) {
    trackedSeverities = trackedSeverities.slice(0, minSeverityIndex + 1);
  }

  subscribe(appWillStart$, ({ getState }) => {
    init({
      dsn: 'https://1a444b262ac6405594ab33fb0102b377@sentry.io/1398210',
      environment: env,
      debug: env === 'development',
      release: pckVersion,
      attachStacktrace: true,
      sampleRate,
      beforeSend(event) {
        if (event.level && !trackedSeverities.includes(event.level)) {
          return null;
        }
        // eslint-disable-next-line no-param-reassign
        event.extra = {
          ...event.extra || {},
          routerStack: getRouterStack(getState()).slice(-5),
        };

        return event;
      },
    });

    configureScope((scope) => {
      scope.setTag('marketId', appConfig.marketId);
      scope.setTag('appId', appConfig.appId);
      scope.setTag('pwaVersion', pckVersion);
      scope.setTag('theme', themeName);
      scope.setTag('language', appConfig.language);
    });

    if (window) {
      window.onerror = (message, source, lineno, colno, error) => {
        captureException(error);
      };
    }

    emitter.addListener(SOURCE_TRACKING, (error) => {
      withScope((scope) => {
        if (error.context) {
          scope.setExtra('trackerName', error.context);
        }
        captureException(error);
      });
    });
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
    withScope((scope) => {
      scope.setLevel(SentrySeverity.Debug);
      captureMessage('App did start');
    });
  });

  // Add some stack trace and log to sentry
  subscribe(appError$, ({ action }) => {
    withScope((scope) => {
      if (action.error.stack) {
        scope.setExtra('stack', action.error.stack);
      }
      captureException(action.error);
    });
  });
};
