export const FAVORITES_PATH = '/favourite_list';

export const ADD_PRODUCT_TO_FAVORITES = 'ADD_PRODUCT_TO_FAVORITES';
export const REMOVE_PRODUCT_FROM_FAVORITES = 'REMOVE_PRODUCT_FROM_FAVORITES';

/** @deprecated */
export const REQUEST_FAVORITES = 'REQUEST_FAVORITES';
/** @deprecated */
export const RECEIVE_FAVORITES = 'RECEIVE_FAVORITES';
/** @deprecated */
export const ERROR_FAVORITES = 'ERROR_FAVORITES';
/** @deprecated */
export const ERROR_FETCH_FAVORITES = 'ERROR_FETCH_FAVORITES';

export const REQUEST_ADD_FAVORITES = 'REQUEST_ADD_FAVORITES';
export const SUCCESS_ADD_FAVORITES = 'SUCCESS_ADD_FAVORITES';
export const ERROR_ADD_FAVORITES = 'ERROR_ADD_FAVORITES';

export const REQUEST_REMOVE_FAVORITES = 'REQUEST_REMOVE_FAVORITES';
export const SUCCESS_REMOVE_FAVORITES = 'SUCCESS_REMOVE_FAVORITES';
export const ERROR_REMOVE_FAVORITES = 'ERROR_REMOVE_FAVORITES';

export const REQUEST_FAVORITES_IDS = 'REQUEST_FAVORITES_IDS';
export const RECEIVE_FAVORITES_IDS = 'RECEIVE_FAVORITES_IDS';
export const ERROR_FAVORITES_IDS = 'ERROR_FAVORITES_IDS';

/** @deprecated */
export const CANCEL_REQUEST_SYNC_FAVORITES = 'CANCEL_REQUEST_SYNC_FAVORITES';

/** @deprecated */
export const IDLE_SYNC_FAVORITES = 'IDLE_SYNC_FAVORITES';
/** @deprecated */
export const REQUEST_FLUSH_FAVORITES_BUFFER = 'REQUEST_FLUSH_FAVORITES_BUFFER';

// Defines a local error code which is not related to a backend call
/** @deprecated */
export const FAVORITES_LIMIT_ERROR = 'FAVORITES_LIMIT_ERROR';

export const FAVORITES_LIFETIME = 3600000; // 1 hour
export const FETCH_FAVORITES_THROTTLE = (process.env && process.env.NODE_ENV === 'test') ? 0 : 2000;
export const FAVORITE_ACTION_BUFFER_TIME = 500;
export const FAVORITE_BUTTON_DEBOUNCE_TIME = 200; // Handles duplicated add/remove button clicks
