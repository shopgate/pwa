export const CATEGORY_PATH = '/category';
export const ROOT_CATEGORY_PATTERN = CATEGORY_PATH;
export const CATEGORY_PATTERN = `${CATEGORY_PATH}/:categoryId`;
export const CATEGORY_FILTER_PATTERN = `${CATEGORY_PATH}/:categoryId/filter`;
export const CATEGORY_ALL_PATTERN = `${CATEGORY_PATH}/:categoryId/all`;
export const CATEGORY_ALL_FILTER_PATTERN = `${CATEGORY_PATH}/:categoryId/all/filter`;

export const CATEGORY_LIFETIME = 3600000; // 1 hour in milliseconds

export const REQUEST_ROOT_CATEGORIES = 'REQUEST_ROOT_CATEGORIES';
export const RECEIVE_ROOT_CATEGORIES = 'RECEIVE_ROOT_CATEGORIES';
export const ERROR_ROOT_CATEGORIES = 'ERROR_ROOT_CATEGORIES';

export const REQUEST_CATEGORY = 'REQUEST_CATEGORY';
export const RECEIVE_CATEGORY = 'RECEIVE_CATEGORY';
export const ERROR_CATEGORY = 'ERROR_CATEGORY';

export const REQUEST_CATEGORY_CHILDREN = 'REQUEST_CATEGORY_CHILDREN';
export const RECEIVE_CATEGORY_CHILDREN = 'RECEIVE_CATEGORY_CHILDREN';
export const ERROR_CATEGORY_CHILDREN = 'ERROR_CATEGORY_CHILDREN';
