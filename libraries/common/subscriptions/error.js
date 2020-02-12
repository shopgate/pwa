import after from 'lodash/after';
import before from 'lodash/before';
import over from 'lodash/over';
import {
  init,
  configureScope,
  captureException,
  captureMessage,
  captureEvent,
  withScope,
  Severity as SentrySeverity,
} from '@sentry/browser';
import {
  EBIGAPI,
  emitter,
  errorManager,
  ETIMEOUT,
  ENETUNREACH,
  EUNKNOWN,
} from '@shopgate/pwa-core';
import { SOURCE_TRACKING, SOURCE_CONSOLE, Severity } from '@shopgate/pwa-core/constants/ErrorManager';
import {
  // eslint-disable-next-line import/no-named-default
  default as appConfig,
  themeName,
  pckVersion,
} from '../helpers/config';
import { env } from '../helpers/environment';
import { transformGeneralPipelineError } from './helpers/pipeline';
import { historyPop } from '../actions/router';
import showModal from '../actions/modal/showModal';
import { getUserData } from '../selectors/user';
import { userDidUpdate$ } from '../streams/user';
import { clientInformationDidUpdate$ } from '../streams/client';
import { appWillStart$, appDidStart$ } from '../streams/app';
import { appError$, pipelineError$ } from '../streams/error';
import { getRouterStack } from '../selectors/router';
import { MODAL_PIPELINE_ERROR } from '../constants/ModalTypes';
import ToastProvider from '../providers/toast';

/**
 * App errors subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default (subscribe) => {
  /** Set general error transformations */
  subscribe(appWillStart$, () => {
    errorManager.setMessage({
      code: EUNKNOWN,
      message: transformGeneralPipelineError,
    }).setMessage({
      code: EBIGAPI,
      message: transformGeneralPipelineError,
    }).setMessage({
      code: ETIMEOUT,
      message: 'modal.body_error',
    }).setMessage({
      code: ENETUNREACH,
      message: 'modal.body_error',
    });
  });

  /** Show a message to the user in case of pipeline error */
  subscribe(pipelineError$, ({ dispatch, action, events }) => {
    const { error } = action;
    const {
      message, code, context, meta,
    } = error;

    /** Show modal thunk */
    const showModalError = () => {
      dispatch(showModal({
        confirm: 'modal.ok',
        dismiss: null,
        title: null,
        message,
        type: MODAL_PIPELINE_ERROR,
        params: {
          pipeline: context,
          request: meta.input,
          message: meta.message,
          code,
        },
      }));
    };

    let shouldShowToast = message === 'error.general';
    if ([ETIMEOUT, ENETUNREACH].includes(code) && message === 'modal.body_error') {
      shouldShowToast = true;
    }
    // It was transformed general error. let it popup after 10 toast clicks
    if (shouldShowToast) {
      const showToastAfter = after(9, showModalError);
      // Recursively show same toast message until clicked 10 times
      const showToast = before(10, () => {
        events.emit(ToastProvider.ADD, {
          id: 'pipeline.error',
          message: 'error.general',
          action: over([showToast, showToastAfter]),
        });
      });
      showToast();
      return;
    }

    showModalError();
  });

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
    emitter.addListener(SOURCE_CONSOLE, (args) => {
      withScope((scope) => {
        scope.setLevel(SentrySeverity.Error);
        scope.setExtra('error', args);
        captureMessage(args[0]);
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

  const allErrors$ = pipelineError$.merge(appError$);
  // Log all error messages which are presented to the user
  subscribe(allErrors$, ({ action }) => {
    withScope((scope) => {
      scope.setTag('error', 'E_USER');
      scope.setTag('errorCode', action.error.code);
      scope.setTag('errorMessage', action.error.message);
      captureEvent({
        message: action.error.meta.message,
        extra: action.error,
      });
    });
  });
};
