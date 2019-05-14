import {
  REQUEST_CLIENT_INFORMATION,
  RECEIVE_CLIENT_INFORMATION,
  ERROR_CLIENT_INFORMATION,
  RECEIVE_CLIENT_CONNECTIVITY,
} from '../../constants/ActionTypes';

/**
 * Creates the dispatched REQUEST_CLIENT_INFORMATION action object.
 * @returns {Object} The dispatched action object.
 */
export const requestClientInformation = () => ({
  type: REQUEST_CLIENT_INFORMATION,
});

/**
 * Creates the dispatched RECEIVE_CLIENT_INFORMATION action object.
 * @param {Object} data The received client information data.
 * @returns {Object} The dispatched action object.
 */
export const receiveClientInformation = data => ({
  type: RECEIVE_CLIENT_INFORMATION,
  data,
});

/**
 * Creates the dispatched ERROR_CLIENT_INFORMATION action object.
 * @returns {Object} The dispatched action object.
 */
export const errorClientInformation = () => ({
  type: ERROR_CLIENT_INFORMATION,
});

/**
 * Creates the dispatched RECEIVE_CLIENT_CONNECTIVITY action object.
 * @param {Object} data The received client connectivity data.
 * @returns {Object} The dispatched action object.
 */
export const receiveClientConnectivity = data => ({
  type: RECEIVE_CLIENT_CONNECTIVITY,
  data,
});
