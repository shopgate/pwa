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

let addTimeout = null;

/**
 * Resets the throttle timer.
 */
const clearAddTimer = () => {
  clearTimeout(addTimeout);
  addTimeout = null;
};

/**
 * Add favorites action.
 * @param {string} productId Product identifier.
 * @returns {Promise} PipelineRequest dispatch.
 */
const addFavorites = productId => (dispatch) => {
  const addPromise = new Promise((res, rej) => {
    if (!productId) {
      rej();
      return;
    }

    dispatch(requestAddFavorites(productId));

    if (addTimeout) {
      clearAddTimer();
    }

    addTimeout = setTimeout(() => {
      new PipelineRequest('addFavorites')
        .setInput({ productId })
        .dispatch()
        .then(res)
        .catch(rej);
    }, 1000);
  });

  addPromise
    .then(() => {
      clearAddTimer();
      dispatch(receiveAddFavorites());
    })
    .catch(() => {
      clearAddTimer();
      dispatch(errorAddFavorites(productId));
    });
  return addPromise;
};

/**
 * Remove favorites action.
 * @param {string} productId Product identifier.
 * @returns {Promise} PipelineRequest dispatch.
 */
const removeFavorites = productId => (dispatch) => {
  const removePromise = new Promise((res, rej) => {
    if (!productId) {
      rej();
      return;
    }

    if (addTimeout) {
      clearAddTimer();
      res(abortAddFavorites(productId));
      return;
    }
    dispatch(requestRemoveFavorites(productId));

    new PipelineRequest('deleteFavorites')
      .setInput({ productId })
      .dispatch()
      .then(res(receiveRemoveFavorites()))
      .catch(rej);
  });

  removePromise
    .then(action => dispatch(action))
    .catch(() => dispatch(errorRemoveFavorites(productId)));

  return removePromise;
};

export {
  addFavorites,
  removeFavorites,
};
