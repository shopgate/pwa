import { DataRequest } from '@shopgate/engage/core/classes';
import { setDebugLoggingEnabled } from '@shopgate/engage/core/commands';

/**
 * Enable debug logging.
 * @return {Function} A redux thunk.
 */
export const enableDebugLogging = () => () => {
  setDebugLoggingEnabled();
  (new DataRequest('ajax_started_live_logging')).dispatch();
};
