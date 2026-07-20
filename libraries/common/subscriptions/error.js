import { isAvailable } from '@shopgate/native-modules';
import {
  init,
  addBreadcrumb,
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
  EFAVORITE,
} from '@shopgate/pwa-core';
import { hasWebBridge } from '@shopgate/engage/core';
import { SOURCE_TRACKING, SOURCE_CONSOLE, Severity } from '@shopgate/pwa-core/constants/ErrorManager';
import { main$ } from '../streams/main';
import {
  // eslint-disable-next-line import/no-named-default
  default as appConfig,
  themeName,
  pckVersion,
} from '../helpers/config';
import { env } from '../helpers/environment';
import { transformGeneralPipelineError, getDisplayErrorMessage } from './helpers/pipeline';
import { historyPop } from '../actions/router';
import showModal from '../actions/modal/showModal';
import { getUserData } from '../selectors/user';
import { userDidUpdate$ } from '../streams/user';
import { clientInformationDidUpdate$ } from '../streams/client';
import { appWillInit$, appWillStart$, appDidStart$ } from '../streams/app';
import { appError$, pipelineError$ } from '../streams/error';
import { getRouterStack } from '../selectors/router';
import { MODAL_PIPELINE_ERROR } from '../constants/ModalTypes';
import ToastProvider from '../providers/toast';

// Generic, translated fallback shown when a backend error carries no code we can map to a message.
const GENERIC_ERROR_MESSAGE = 'modal.body_error';

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
    })
      .setMessage({
        code: EFAVORITE,
        message: 'favorites.error_general',
      });
  });

  /** Show a message to the user in case of pipeline error */
  subscribe(pipelineError$, ({
    dispatch, getState, events, action,
  }) => {
    const { error } = action;
    const {
      code, context, meta = {},
    } = error;

    const { behavior, message: originalMessage } = meta;

    if (behavior) {
      behavior({
        dispatch,
        getState,
        events,
        error,
      });
      return;
    }

    // Never surface a raw backend message to the user: show the extension's own translated
    // message, a code-mapped translated message, or a generic fallback. The resolver is the single
    // source of truth for both the text and whether it is ready-to-display (`displayTranslated`) or
    // a locale key that must still go through I18n.Text.
    const {
      message: displayMessage,
      translated: displayTranslated,
    } = getDisplayErrorMessage(error, GENERIC_ERROR_MESSAGE);

    /**
     * Shows the pipeline error modal. When devMode is set, the modal opens directly on the
     * developer detail view (pipeline, code, raw message, params) — used for the toast long-press.
     * @param {boolean} [devMode=false] Whether to open the modal in developer detail mode.
     */
    const showModalError = (devMode = false) => {
      dispatch(showModal({
        confirm: 'modal.ok',
        dismiss: null,
        title: null,
        message: displayMessage,
        type: MODAL_PIPELINE_ERROR,
        params: {
          pipeline: context,
          request: meta.input,
          message: originalMessage,
          code,
          translated: displayTranslated,
          messageParams: meta.additionalParams,
          devMode,
        },
      }));
    };

    // Unknown/generic and connection-style backend errors surface as a toast instead of a modal.
    // Long-pressing the toast opens the error modal in developer detail mode.
    const isConnectionError = displayMessage === 'error.general'
      || [ETIMEOUT, ENETUNREACH].includes(code);
    const shouldShowToast = isConnectionError || displayMessage === GENERIC_ERROR_MESSAGE;

    if (shouldShowToast) {
      // Connection-style errors show the generic connection message, but never override a message
      // an extension already translated for us.
      const useGenericConnectionText = isConnectionError && !displayTranslated;
      events.emit(ToastProvider.ADD, {
        id: 'pipeline.error',
        message: useGenericConnectionText ? 'error.general' : displayMessage,
        onLongPress: () => showModalError(true),
      });
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

  const ignoredDefaultBreadcrumbs = [
    'console',
    'fetch',
    'xhr',
    'ui.click',
  ];

  let trackedSeverities = Object.getOwnPropertySymbols(severityMap).map(s => severityMap[s]);
  const minSeverityIndex = trackedSeverities.indexOf(level);
  if (minSeverityIndex > -1) {
    trackedSeverities = trackedSeverities.slice(0, minSeverityIndex + 1);
  }

  subscribe(appWillInit$, ({ getState }) => {
    init({
      dsn: 'https://1a444b262ac6405594ab33fb0102b377@sentry.io/1398210',
      environment: appConfig.omniStage || env,
      debug: env === 'development',
      release: pckVersion,
      attachStacktrace: true,
      sampleRate,
      beforeBreadcrumb(breadcrumb) {
        if (ignoredDefaultBreadcrumbs.includes(breadcrumb.category)) {
          return null;
        }
        return breadcrumb;
      },
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
      scope.setTag('isWebsite', hasWebBridge());
      scope.setTag('isReactNativeApp', isAvailable());
      scope.setTag('merchantCode', appConfig.omniMerchantCode);
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
        captureMessage('Console error');
      });
    });
  });

  subscribe(main$, ({ action }) => {
    addBreadcrumb({
      category: 'redux',
      message: `[Redux] ${action.type}`,
      level: SentrySeverity.Info,
      data: { ...action },
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
    const { error = {} } = action;
    const {
      code,
      message,
      meta: {
        message: metaMessage,
      } = {},
    } = error;
    withScope((scope) => {
      scope.setTag('error', 'E_USER');
      scope.setTag('errorCode', code);
      scope.setTag('errorMessage', message);
      captureEvent({
        message: metaMessage || message,
        extra: error,
      });
    });
  });
};
