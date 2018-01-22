/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
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
} from '../action-creators/addFavorites';

import {
  receiveRemoveFavorites,
  requestRemoveFavorites,
  errorRemoveFavorites,
} from '../action-creators/removeFavorites';

let addTimeout = null;

/**
 * Add favorites action.
 * @param {string} productId Product identifier.
 * @returns {Promise} PipelineRequest dispatch.
 */
const addFavorites = productId => (dispatch) => {
  const delayedRequest = new Promise((res, rej) => {
    if (addTimeout) {
      res();
      return;
    }

    dispatch(requestAddFavorites(productId));

    addTimeout = setTimeout(() => {
      new PipelineRequest('addFavorites')
        .setInput({ productId })
        .dispatch()
        .then(res)
        .catch(rej);
    }, 1000);
  });

  delayedRequest
    .then((result) => {
      dispatch(receiveAddFavorites(result));
    })
    .catch(() => {
      dispatch(errorAddFavorites(productId));
    })
    .finally(() => {
      clearTimeout(addTimeout);
      addTimeout = null;
    });

  return delayedRequest;
};

/**
 * Remove favorites action.
 * @param {string} productId Product identifier.
 * @returns {Promise} PipelineRequest dispatch.
 */
const removeFavorites = productId => (dispatch) => {
  const request = new PipelineRequest('deleteFavorites')
    .setInput({ productId })
    .dispatch();

  // TODO only execute when no timeout set
  clearTimeout(addTimeout);
  addTimeout = null;

  dispatch(requestRemoveFavorites(productId));
  request
    .then((result) => {
      dispatch(receiveRemoveFavorites(result));
    })
    .catch(() => {
      dispatch(errorRemoveFavorites(productId));
    });

  return request;
};

export {
  addFavorites,
  removeFavorites,
};
