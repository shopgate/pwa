import { produce } from 'immer';
import { SET_COUPON_FIELD_VALUE, SET_COUPON_FIELD_ERROR } from '../constants';

const defaultState = {
  error: '',
  value: '',
};

/**
 * The reducer for all checkout related state.
 * @param {Object} state The application state.
 * @param {Object} action The redux action.
 * @returns {Object}
 */
export default (state = defaultState, action) => {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case SET_COUPON_FIELD_VALUE: {
        draft.value = action.value;
        break;
      }

      case SET_COUPON_FIELD_ERROR: {
        draft.error = action.message;
        break;
      }

      default:
        break;
    }
  });
  /* eslint-enable no-param-reassign */
  return producer(state);
};

