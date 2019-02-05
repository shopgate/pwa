/**
 * ------- CLIENT -------
 */
export const REQUEST_CLIENT_INFORMATION = 'REQUEST_CLIENT_INFORMATION';
export const RECEIVE_CLIENT_INFORMATION = 'RECEIVE_CLIENT_INFORMATION';
export const ERROR_CLIENT_INFORMATION = 'ERROR_CLIENT_INFORMATION';

/**
 * ------- APP -------
 */
export const APP_DID_START = 'APP_DID_START';
export const APP_WILL_START = 'APP_WILL_START';
export const WILL_REGISTER_LINK_EVENTS = 'WILL_REGISTER_LINK_EVENTS';
export const DID_REGISTER_LINK_EVENTS = 'DID_REGISTER_LINK_EVENTS';

/**
 * ------- MENU -------
 */
export const REQUEST_MENU = 'REQUEST_MENU';
export const RECEIVE_MENU = 'RECEIVE_MENU';
export const ERROR_MENU = 'ERROR_MENU';

/**
 * ------- VIEW -------
 */
export const SET_VIEW_LOADING = 'SET_VIEW_LOADING';
export const UNSET_VIEW_LOADING = 'UNSET_VIEW_LOADING';
export const INCREMENT_VIEW_LOADING = 'INCREMENT_VIEW_LOADING';
export const DECREMENT_VIEW_LOADING = 'DECREMENT_VIEW_LOADING';

/**
 * ------- PAGE -------
 */
export const REQUEST_PAGE_CONFIG = 'REQUEST_PAGE_CONFIG';
export const RECEIVE_PAGE_CONFIG = 'RECEIVE_PAGE_CONFIG';
export const ERROR_PAGE_CONFIG = 'ERROR_PAGE_CONFIG';

/**
 * ------- HISTORY --------
 */
export const HISTORY_PUSH_ACTION = 'PUSH';
export const HISTORY_POP_ACTION = 'POP';
export const HISTORY_REPLACE_ACTION = 'REPLACE';
// PUSH NOTIFICATION
export const OPEN_PUSH_NOTIFICATION = 'OPEN_PUSH_NOTIFICATION';
// DEEP LINK
export const OPEN_DEEP_LINK = 'OPEN_DEEP_LINK';

/**
 * ------- MODALS -------
 */
export const CREATE_MODAL = 'CREATE_MODAL';
export const REMOVE_MODAL = 'REMOVE_MODAL';

/**
 * ------- USER -------
 */
// LOGIN
export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const SUCCESS_LOGIN = 'SUCCESS_LOGIN';
export const ERROR_LOGIN = 'ERROR_LOGIN';
export const ERROR_LEGACY_CONNECT_REGISTER = 'ERROR_LEGACY_CONNECT_REGISTER';
export const TOGGLE_LOGGED_IN = 'TOGGLE_LOGGED_IN';
export const DISABLE_LOGIN = 'DISABLE_LOGIN';
// LOGOUT
export const REQUEST_LOGOUT = 'REQUEST_LOGOUT';
export const SUCCESS_LOGOUT = 'SUCCESS_LOGOUT';
export const ERROR_LOGOUT = 'ERROR_LOGOUT';
// USER
export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const ERROR_USER = 'ERROR_USER';

/**
 * --------- URL ------------
 */
export const REQUEST_URL = 'REQUEST_URL';
export const RECEIVE_URL = 'RECEIVE_URL';
export const ERROR_URL = 'ERROR_URL';

/**
 * ------- ERROR -------
 */
export const APP_ERROR = 'APP_ERROR';
export const PIPELINE_ERROR = 'PIPELINE_ERROR';

/**
 * --------- ROUTER ------------
 */
export const NAVIGATE = 'NAVIGATE';
export const ROUTE_WILL_ENTER = 'ROUTE_WILL_ENTER';
export const ROUTE_DID_ENTER = 'ROUTE_DID_ENTER';
export const ROUTE_WILL_LEAVE = 'ROUTE_WILL_LEAVE';
export const ROUTE_DID_LEAVE = 'ROUTE_DID_LEAVE';
export const ROUTE_DID_UPDATE = 'ROUTE_DID_UPDATE';
