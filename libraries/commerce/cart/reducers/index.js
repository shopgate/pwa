import remove from 'lodash/remove';
import {
  ADD_PRODUCTS_TO_CART,
  DELETE_PRODUCTS_FROM_CART,
  UPDATE_PRODUCTS_IN_CART,
  ERROR_ADD_PRODUCTS_TO_CART,
  REQUEST_CART,
  RECEIVE_CART,
  ERROR_CART,
  SET_CART_PENDING_PRODUCT_COUNT,
} from '../constants';

const defaultState = {
  items: [],
  totals: [],
  productPendingCount: 0,
  flags: {},
};

/**
 * Stores all the cart items.
 * The cart will be cached in localStorage as defined in './library/store/configureStore.js'.
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = defaultState, action) => {
  switch (action.type) {
    case ADD_PRODUCTS_TO_CART:
    case ERROR_ADD_PRODUCTS_TO_CART: {
      return state;
    }
    case DELETE_PRODUCTS_FROM_CART: {
      return {
        ...state,
        items: remove(state.items, item => !action.cartItemIds.includes(item.id)),
      };
    }
    case UPDATE_PRODUCTS_IN_CART: {
      return {
        ...state,
        items: state.items.map((item) => {
          const { updateData } = action;
          // Search the stored cart item, which shall be updated
          const match = updateData.find(update => item.id === update.cartItemId);

          // Apply the updated quantity to the cart item in the store.
          return {
            ...item,
            ...(typeof match !== 'undefined') && { quantity: match.quantity },
          };
        }),
      };
    }
    case REQUEST_CART: {
      return {
        ...state,
        isFetching: true,
        expires: 0,
      };
    }
    case RECEIVE_CART: {
      const { cartItems, ...cart } = action.cart;
      return {
        ...state,
        ...cart,
        expires: 0,
        items: cartItems,
        isFetching: false,
        productPendingCount: 0,
      };
    }
    case ERROR_CART:
      return {
        ...state,
        isFetching: false,
        expires: 0,
      };
    case SET_CART_PENDING_PRODUCT_COUNT:
      return {
        ...state,
        productPendingCount: Math.max(0, action.count),
      };
    default:
      return state;
  }
};
