import { produce } from 'immer';
import {
  REQUEST_PAGE_CONFIG_V2,
  RECEIVE_PAGE_CONFIG_V2,
  ERROR_PAGE_CONFIG_V2,
} from '../constants';

const defaultState = {};

/**
 * Stores state of the v2 implementation of pages.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
export function pageV2(state = defaultState, action) {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case REQUEST_PAGE_CONFIG_V2: {
        const { pageType, pageSlug } = action;
        draft[pageType] = draft[pageType] || {};
        draft[pageType][pageSlug] = {
          isFetching: true,
          data: null,
        };
        break;
      }

      case RECEIVE_PAGE_CONFIG_V2: {
        const { pageType, pageSlug, data } = action;
        draft[pageType] = draft[pageType] || {};
        draft[pageType][pageSlug] = {
          isFetching: false,
          data,
        };
        break;
      }

      case ERROR_PAGE_CONFIG_V2: {
        const { pageType, pageSlug } = action;
        draft[pageType] = draft[pageType] || {};
        draft[pageType][pageSlug] = {
          isFetching: false,
          data: null,
        };
        break;
      }
      default:
        break;
    }
  });

  /* eslint-enable no-param-reassign */

  return producer(state);
}
