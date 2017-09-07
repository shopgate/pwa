/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import {
  REQUEST_ROOT_CATEGORIES,
  RECEIVE_ROOT_CATEGORIES,
  ERROR_ROOT_CATEGORIES,
  REQUEST_CATEGORY,
  RECEIVE_CATEGORY,
  ERROR_CATEGORY,
  REQUEST_CATEGORY_CHILDREN,
  RECEIVE_CATEGORY_CHILDREN,
  ERROR_CATEGORY_CHILDREN,
  SET_CURRENT_CATEGORY_ID,
} from '../constants';

/**
 * Dispatches the REQUEST_ROOT_CATEGORIES action.
 * @return {Object} The REQUEST_ROOT_CATEGORIES action.
 */
export const requestRootCategories = () => ({
  type: REQUEST_ROOT_CATEGORIES,
});

/**
 * Dispatches the RECEIVE_ROOT_CATEGORIES action.
 * @param {Array} categories The received root categories.
 * @return {Object} The RECEIVE_ROOT_CATEGORIES action.
 */
export const receiveRootCategories = categories => ({
  type: RECEIVE_ROOT_CATEGORIES,
  categories,
});
/**
 * Dispatches the ERROR_ROOT_CATEGORIES action.
 * @return {Object} The ERROR_ROOT_CATEGORIES action.
 */
export const errorRootCategories = () => ({
  type: ERROR_ROOT_CATEGORIES,
});

/**
 * Dispatches the REQUEST_CATEGORY action.
 * @param {string} categoryId The ID of the category to be requested.
 * @return {Object} The REQUEST_CATEGORY action.
 */
export const requestCategory = categoryId => ({
  type: REQUEST_CATEGORY,
  categoryId,
});

/**
 * Dispatches the RECEIVE_CATEGORY action.
 * @param {string} categoryId The ID of the received category.
 * @param {Object} categoryData The data of the received category.
 * @param {Array} categoryChildren The children of received category.
 * @return {Object} The RECEIVE_CATEGORY action.
 */
export const receiveCategory = (categoryId, categoryData, categoryChildren) => ({
  type: RECEIVE_CATEGORY,
  categoryId,
  categoryData,
  categoryChildren,
  products: [],
});

/**
 * Dispatches the ERROR_CATEGORY action.
 * @param {string} categoryId The ID of the received category.
 * @return {Object} The ERROR_CATEGORY action.
 */
export const errorCategory = categoryId => ({
  type: ERROR_CATEGORY,
  categoryId,
});

/**
 * Dispatches the REQUEST_CATEGORY_CHILDREN action.
 * @param {string} categoryId The ID of the category to request children for.
 * @return {Object} The REQUEST_CATEGORY_CHILDREN action.
 */
export const requestCategoryChildren = categoryId => ({
  type: REQUEST_CATEGORY_CHILDREN,
  categoryId,
});

/**
 * Dispatches the RECEIVE_CATEGORY_CHILDREN action.
 * @param {string} categoryId The ID of the category to receive children for.
 * @param {Array} categoryChildren The requested category children.
 * @return {Object} The RECEIVE_CATEGORY_CHILDREN action.
 */
export const receiveCategoryChildren = (categoryId, categoryChildren) => ({
  type: RECEIVE_CATEGORY_CHILDREN,
  categoryId,
  categoryChildren,
});

/**
 * Dispatches the ERROR_CATEGORY_CHILDREN action.
 * @param {string} categoryId The ID of the category to receive children for.
 * @return {Object} The ERROR_CATEGORY_CHILDREN action.
 */
export const errorCategoryChildren = categoryId => ({
  type: ERROR_CATEGORY_CHILDREN,
  categoryId,
});

/**
 * Dispatches the SET_CURRENT_CATEGORY_ID action.
 * @param {string} pathname The ID of the category to receive children for.
 * @return {Object} The SET_CURRENT_CATEGORY_ID action.
 */
export const setCurrentCategoryId = (pathname = '') => ({
  type: SET_CURRENT_CATEGORY_ID,
  categoryId: hex2bin(pathname.split('/')[2]),
});
