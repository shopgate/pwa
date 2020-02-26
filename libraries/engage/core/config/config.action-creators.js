// @flow
import * as Redux from 'redux';
import {
  REQUEST_CORE_CONFIG,
  RECEIVE_CORE_CONFIG,
  ERROR_CORE_CONFIG,
} from './config.constants';
import { type MerchantSettings } from './config.types';

/**
 * Dispatches the REQUEST_CORE_CONFIG action.
 * @return {Object} The REQUEST_CORE_CONFIG action.
 */
export const requestConfig = (): Redux.Action<typeof REQUEST_CORE_CONFIG> => ({
  type: REQUEST_CORE_CONFIG,
});

/**
 * Dispatches the RECEIVE_CORE_CONFIG action.
 * @param {Object} config config
 * @return {Object} The RECEIVE_CORE_CONFIG action.
 */
export const receiveConfig = (
  config: MerchantSettings
): Redux.Action<typeof RECEIVE_CORE_CONFIG> => ({
  type: RECEIVE_CORE_CONFIG,
  config,
});

/**
 * Dispatches the ERROR_CORE_CONFIG action.
 * @param {Error} error error
 * @return {Object} The ERROR_CORE_CONFIG action.
 */
export const errorConfig = (error: {}): Redux.Action<typeof ERROR_CORE_CONFIG> => ({
  type: ERROR_CORE_CONFIG,
  error,
});
