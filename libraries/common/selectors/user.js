import { createSelector } from 'reselect';
import { getUrl } from './url';

/**
 * Selects the isLoggedIn state from the user.
 * @param {Object} state The global state.
 * @return {boolean}
 */
export const isUserLoggedIn = state => state.user.login.isLoggedIn;

/**
 * Gets user.data from the redux store.
 * @param {Object} state The application state.
 * @return {Object|null}
 */
export const getUserData = state => state.user.data;

/**
 * Gets the register url.
 * @param {Object} state The application state.
 * @return {string|null}
 */
export const getRegisterUrl = state => getUrl('register', state);

/**
 * Gets user.data.addresses from the redux store.
 * @param {Object} state The application state.
 * @return {UserAddress[]|null}
 */
export const getUserAddresses = createSelector(
  getUserData,
  ({ addresses }) => addresses
);

/**
 * Gets user.data.addresses.default from the redux store.
 * @param {Object} state The application state.
 * @returns {Object|null}
 */
export const getUserDefaultAddresses = createSelector(
  state => state.user.addresses.default,
  defaults => defaults
);

/**
 * Get user address selector to fetch address by id
 * @example
 * getUserAddressIdSelector(state)(addressId)
 *
 * @param {Object} state The application state.
 * @return {function(string): UserAddress|undefined}
 */
export const getUserAddressIdSelector = createSelector(
  getUserAddresses,
  addresses => addressId => addresses.find(address => address.id === addressId)
);
