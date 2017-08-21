import {
  SET_PRODUCT_ID,
  SET_PRODUCT_VARIANT_ID,
  SET_PRODUCT_QUANTITY,
  SET_PRODUCT_OPTION,
  RESET_CURRENT_PRODUCT,
} from '../../product/constants';

const defaultState = {
  productId: null,
  productVariantId: null,
  quantity: 1,
  options: {},
};

/**
 * The current product reducer.
 * Describes the current selections and inputs in the product detail page.
 * @param {Object} [state={}] The current application state.
 * @param {Object} action The action object.
 * @return {Object} The store data.
 */
const currentProduct = (state = defaultState, action) => {
  switch (action.type) {
    case SET_PRODUCT_ID:
      return {
        // When the product changes we reset the currentProduct state.
        ...defaultState,
        productId: action.productId,
      };

    case SET_PRODUCT_VARIANT_ID:
      return {
        ...state,
        productVariantId: action.productVariantId,
      };

    case SET_PRODUCT_QUANTITY:
      return {
        ...state,
        quantity: action.quantity,
      };

    case SET_PRODUCT_OPTION:
      return {
        ...state,
        options: {
          ...state.options,
          [action.optionId]: action.valueId,
        },
      };

    case RESET_CURRENT_PRODUCT:
      return defaultState;

    default:
      return state;
  }
};

export default currentProduct;
