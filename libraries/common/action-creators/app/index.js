import {
  APP_WILL_START,
  APP_DID_START,
  PWA_DID_APPEAR,
  PWA_DID_DISAPPEAR,
  RESET_APP,
  WILL_REGISTER_LINK_EVENTS,
  DID_REGISTER_LINK_EVENTS,
  OPEN_DEEP_LINK,
  OPEN_PUSH_NOTIFICATION,
} from '../../constants/ActionTypes';

/**
 * Creates the dispatched APP_WILL_START action object.
 * @param {Object} location The initial history entry location.
 * @return {Object} The dispatched action object.
 */
export const appWillStart = location => ({
  type: APP_WILL_START,
  location,
});

/**
 * Creates the dispatched APP_DID_START action object.
 * @param {Object} location The initial history entry location.
 * @return {Object} The dispatched action object.
 */
export const appDidStart = location => ({
  type: APP_DID_START,
  location,
});

/**
 * Creates the dispatched RESET_APP action object.
 * @param {string[]} [reducers=undefined] The list of reducers to reset.
 * @return {Object} The dispatched action object.
 */
export const resetApp = reducers => ({
  type: RESET_APP,
  reducers,
});

/**
 * Creates the dispatched PWA_DID_APPEAR action object.
 * @return {Object} The dispatched action object.
 */
export const pwaDidAppear = () => ({
  type: PWA_DID_APPEAR,
});

/**
 * Creates the dispatched PWA_DID_DISAPPEAR action
 * @return {Object} The dispatched action object.
 */
export const pwaDidDisappear = () => ({
  type: PWA_DID_DISAPPEAR,
});

/**
 * Creates the dispatched WILL_REGISTER_LINK_EVENTS action object.
 * @return {Object} The dispatched action object.
 */
export const willRegisterLinkEvents = () => ({
  type: WILL_REGISTER_LINK_EVENTS,
});

/**
 * Creates the dispatched DID_REGISTER_LINK_EVENTS action object.
 * @return {Object} The dispatched action object.
 */
export const didRegisterLinkEvents = () => ({
  type: DID_REGISTER_LINK_EVENTS,
});

/**
 * Creates the dispatched OPEN_DEEP_LINK action object.
 * @param {Object} payload The payload of the deeplink
 * @return {Object} The dispatched action object.
 */
export const openDeepLink = payload => ({
  type: OPEN_DEEP_LINK,
  payload,
});

/**
 * Creates the dispatched OPEN_PUSH_NOTIFICATION action object.
 * @param {string} notificationId The notification ID.
 * @param {string} [link] The link of the notification.
 * @return {Object} The dispatched action object.
 */
export const openPushNotification = (notificationId, link = '') => ({
  type: OPEN_PUSH_NOTIFICATION,
  notificationId,
  link,
});
