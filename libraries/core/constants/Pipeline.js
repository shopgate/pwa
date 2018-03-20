// Pipeline current version.
export const CURRENT_VERSION = 1;

// Pipeline response error.
export const EVENT_PIPELINE_ERROR = 'EVENT_PIPELINE_ERROR';

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

// Pipeline no data found
export const EUNKNOWN = 'EUNKNOWN';

// Pipeline found duplicate data.
export const EEXIST = 'EEXIST';

// Trusted pipeline string.
export const TYPE_TRUSTED = 'trusted';

// Errors from favorites pipeline
export const EFAVORITE = 'EFAVORITE';
export const EBIGAPI = 'EBIGAPI';
