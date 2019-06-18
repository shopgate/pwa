import {
  REQUEST_PRODUCT_RELATIONS,
  RECEIVE_PRODUCT_RELATIONS,
  ERROR_PRODUCT_RELATIONS,
  PRODUCT_LIFETIME,
} from '../constants';

/**
 * Product relations reducer.
 * @param {Object} state State.
 * @param {Object} action Action.
 * @returns {Object}
 */
const productRelationsByHash = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_PRODUCT_RELATIONS:
      return {
        ...state,
        [action.hash]: {
          ...state[action.hash],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_PRODUCT_RELATIONS:
      return {
        ...state,
        [action.hash]: {
          productIds: action.payload.relations.map((product) => {
            if (product.productId) {
              return product.productId;
            }

            return product.id;
          }),
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
        },
      };
    case ERROR_PRODUCT_RELATIONS:
      return {
        ...state,
        [action.hash]: {
          ...state[action.hash],
          isFetching: false,
          expires: 0,
        },
      };
    default:
      return state;
  }
};

export default productRelationsByHash;
