/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import {
  receiveAddFavorites,
  requestAddFavorites,
  errorAddFavorites,
  abortAddFavorites,
} from '../action-creators/addFavorites';

import {
  receiveRemoveFavorites,
  requestRemoveFavorites,
  errorRemoveFavorites,
} from '../action-creators/removeFavorites';

import {
  getProductRelativesOnFavorites,
} from '../selectors/';

const addTimeout = {};

/**
 * Resets the throttle timer.
 * @param {string} productId Product id.
 */
const clearAddTimer = (productId) => {
  clearTimeout(addTimeout[productId]);
  addTimeout[productId] = null;
};

/**
 * Add favorites action.
 * @param {string} productId Product identifier.
 * @param {bool} immediate Send immediately (no throttling).
 * @returns {Promise} PipelineRequest dispatch.
 */
const addFavorites = (productId, immediate = false) => (dispatch) => {
  const addPromise = new Promise((res, rej) => {
    const timeoutTime = immediate ? 0 : 1000;
    if (!productId) {
      rej();
      return;
    }

    dispatch(requestAddFavorites(productId));

    if (!immediate && addTimeout[productId]) {
      clearAddTimer(productId);
    }

    addTimeout[productId] = setTimeout(() => {
      addTimeout[productId] = null;
      new PipelineRequest('addFavorites')
        .setInput({ productId })
        .dispatch()
        .then(res)
        .catch(rej);
    }, timeoutTime);
  });

  addPromise
    .then(() => {
      clearAddTimer(productId);
      dispatch(receiveAddFavorites());
    })
    .catch(() => {
      clearAddTimer(productId);
      dispatch(errorAddFavorites(productId));
    });
  return addPromise;
};
/**
 * Removes single product from favorites.
 * @param {string} productId Product id.
 * @param {function} dispatch Disaptch function.
 * @returns {Promise}
 */
const removeProductFromFavorites = (productId, dispatch) => {
  const removePromise = new Promise((res, rej) => {
    if (!productId) {
      rej();
      return;
    }

    if (addTimeout[productId]) {
      clearAddTimer(productId);
      res(abortAddFavorites(productId));
      return;
    }
    dispatch(requestRemoveFavorites(productId));

    new PipelineRequest('deleteFavorites')
      .setInput({ productId })
      .dispatch()
      .then(() => res(receiveRemoveFavorites()))
      .catch(rej);
  });

  removePromise
    .then(action => dispatch(action))
    .catch(() => dispatch(errorRemoveFavorites(productId)));

  return removePromise;
};

/**
 * Remove favorites action.
 * @param {string} productId Product identifier.
 * @param {bool} withRelatives When true relatives which are on list are also removed.
 * @returns {Promise} PipelineRequest dispatch.
 */
const removeFavorites = (productId, withRelatives = false) => (dispatch, getState) => {
  // Temporary solution
  if (withRelatives) {
    const allIds = getProductRelativesOnFavorites(getState(), productId);
    allIds.forEach(id => removeProductFromFavorites(id, dispatch));
    return;
  }
  removeProductFromFavorites(productId, dispatch);
};
export {
  addFavorites,
  removeFavorites,
};
