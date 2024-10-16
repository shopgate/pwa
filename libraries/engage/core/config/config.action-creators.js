import {
  REQUEST_CORE_CONFIG,
  RECEIVE_CORE_CONFIG,
  ERROR_CORE_CONFIG,
} from './config.constants';

/**
 * Dispatches the REQUEST_CORE_CONFIG action.
 * @return {Object} The REQUEST_CORE_CONFIG action.
 */
export const requestConfig = () => ({
  type: REQUEST_CORE_CONFIG,
});

/**
 * Dispatches the RECEIVE_CORE_CONFIG action.
 * @param {Object} config config
 * @return {Object} The RECEIVE_CORE_CONFIG action.
 */
export const receiveConfig = config => ({
  type: RECEIVE_CORE_CONFIG,
  config,
});

/**
 * Dispatches the ERROR_CORE_CONFIG action.
 * @param {Error} error error
 * @return {Object} The ERROR_CORE_CONFIG action.
 */
export const errorConfig = error => ({
  type: ERROR_CORE_CONFIG,
  error,
});
