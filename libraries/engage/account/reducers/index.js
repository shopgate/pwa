import { produce } from 'immer';
import { SUCCESS_LOGOUT } from '@shopgate/pwa-common/constants/ActionTypes';
import {
  FETCH_CUSTOMER_CONTACTS,
  FETCH_CUSTOMER_CONTACTS_SUCCESS,
  FETCH_CUSTOMER_CONTACTS_ERROR,
  FETCH_CUSTOMER,
  FETCH_CUSTOMER_SUCCESS,
  FETCH_CUSTOMER_ERROR,
} from '../constants/actions';

const initialState = {
  customer: {
    isFetching: false,
    data: null,
  },
  contacts: {
    isFetching: false,
    items: [],
  },
};

/**
 * The reducer for all checkout related state.
 * @param {Object} state The application state.
 * @param {Object} action The redux action.
 * @returns {Object}
 */
export default function checkoutReducer(state = initialState, action) {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case FETCH_CUSTOMER_CONTACTS: {
        draft.contacts.isFetching = true;
        break;
      }

      case FETCH_CUSTOMER_CONTACTS_ERROR: {
        draft.contacts.isFetching = false;
        break;
      }

      case FETCH_CUSTOMER_CONTACTS_SUCCESS: {
        draft.contacts.isFetching = false;
        draft.contacts.items = action.contacts;
        break;
      }

      case FETCH_CUSTOMER: {
        draft.customer.isFetching = true;
        break;
      }

      case FETCH_CUSTOMER_ERROR: {
        draft.customer.isFetching = false;
        break;
      }

      case FETCH_CUSTOMER_SUCCESS: {
        draft.customer.isFetching = false;
        draft.customer.data = action.customer;
        break;
      }

      case SUCCESS_LOGOUT: {
        draft.customer = initialState.customer;
        draft.contacts = initialState.contacts;
        break;
      }

      default:
        break;
    }
  });
  /* eslint-enable no-param-reassign */
  return producer(state);
}
