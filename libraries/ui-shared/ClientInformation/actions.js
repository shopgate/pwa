import DataRequest from '@shopgate/pwa-core/classes/DataRequest';
import setDebugLoggingEnabled from '@shopgate/pwa-core/commands/setDebugLoggingEnabled';

/**
 * Enable debug logging.
 * @return {Function} A redux thunk.
 */
export const enableDebugLogging = () => () => {
  setDebugLoggingEnabled();
  (new DataRequest('ajax_started_live_logging')).dispatch();
};
