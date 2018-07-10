// Pipeline current version.
export const CURRENT_VERSION = 1;

// Pipeline response error.
export const EVENT_PIPELINE_ERROR = 'EVENT_PIPELINE_ERROR';

// Error from native app framework - PipelineRequest timeout
export const E999 = '-999';

// Pipeline timeout error.
export const ETIMEOUT = 'ETIMEOUT';

// A pipeline response was rejected by the request manager.
export const EPIPELINERESPONSEREJECTED = 'EPIPELINERESPONSEREJECTED';

// Pipeline no access.
export const EACCESS = 'EACCESS';

// Pipeline invalid credentials.
export const EINVALIDCREDENTIALS = 'EINVALIDCREDENTIALS';

/**
 * A pipeline can't be called in the given context.
 * For example the login pipeline when the user is already logged in.
 */
export const EINVALIDCALL = 'EINVALIDCALL';

export const ELEGACYSGCONNECT = 'ELEGACYSGCONNECT';

// Pipeline no data found
export const EUNKNOWN = 'EUNKNOWN';
// Pipeline remote API not found
export const ENOTFOUND = 'ENOTFOUND';

// Pipeline found duplicate data.
export const EEXIST = 'EEXIST';

// Trusted pipeline string.
export const TYPE_TRUSTED = 'trusted';

// Errors from favorites pipeline
export const EFAVORITE = 'EFAVORITE';
export const EBIGAPI = 'EBIGAPI';

export const SHOPGATE_CART_GET_CART = 'shopgate.cart.getCart';
export const SHOPGATE_CART_ADD_PRODUCTS = 'shopgate.cart.addProducts';
export const SHOPGATE_CART_UPDATE_PRODUCTS = 'shopgate.cart.updateProducts';
export const SHOPGATE_CART_DELETE_PRODUCTS = 'shopgate.cart.deleteProducts';
export const SHOPGATE_CART_ADD_COUPONS = 'shopgate.cart.addCoupons';
export const SHOPGATE_CART_DELETE_COUPONS = 'shopgate.cart.deleteCoupons';
