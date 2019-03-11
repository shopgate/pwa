// Pipeline current version.
export const CURRENT_VERSION = 1;

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

// General bigapi errors that can occur during multiple pipelines, accessing bigapi data
export const EBIGAPI = 'EBIGAPI';

/**
 * Error that is thrown if login was uncomplete. Used for external identity services.
 */
export const EINCOMPLETELOGIN = 'EINCOMPLETELOGIN';

// Validation errors
export const EVALIDATION = 'EVALIDATION';

