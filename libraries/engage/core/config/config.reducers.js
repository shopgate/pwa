// @flow
import * as Redux from 'redux';
import {
  REQUEST_CORE_CONFIG,
  RECEIVE_CORE_CONFIG,
  ERROR_CORE_CONFIG,
  CONFIG_LIFETIME,
} from './config.constants';
import { type ConfigState } from './config.types';

/**
 * Stores the product locations by the ID of the product.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function config(state: ConfigState = {}, action: Redux.Action): ConfigState {
  switch (action.type) {
    case REQUEST_CORE_CONFIG:
      return {
        ...state,
        isFetching: true,
        expires: 0,
      };
    case RECEIVE_CORE_CONFIG:
      return {
        ...state,
        ...action.config,
        isFetching: false,
        expires: Date.now() + CONFIG_LIFETIME,
      };
    case ERROR_CORE_CONFIG:
      return {
        ...state,
        isFetching: false,
        expires: 0,
      };
    default:
      return state;
  }
}
