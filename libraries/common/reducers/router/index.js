import cloneDeep from 'lodash/cloneDeep';
import { stack } from '@virtuous/conductor';
import {
  ROUTE_WILL_ENTER,
  ROUTE_WILL_LEAVE,
  ROUTE_DID_UPDATE,
} from '../../constants/ActionTypes';

const defaultState = {
  currentRoute: null,
  stack: [],
};

/**
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @returns {Object}
 */
export default function router(state = defaultState, action) {
  switch (action.type) {
    case ROUTE_WILL_LEAVE: {
      return {
        ...state,
        stack: Array.from(stack.getAll().values()),
      };
    }
    case ROUTE_WILL_ENTER:
      return {
        ...state,
        stack: Array.from(stack.getAll().values()),
        currentRoute: cloneDeep(action.route),
      };
    case ROUTE_DID_UPDATE: {
      const { id: currentId } = state.currentRoute || {};
      const { id: updatedId } = action.route;

      if (currentId === updatedId) {
        return {
          ...state,
          stack: Array.from(stack.getAll().values()),
          currentRoute: cloneDeep(action.route),
        };
      }

      return state;
    }
    default:
      return state;
  }
}
