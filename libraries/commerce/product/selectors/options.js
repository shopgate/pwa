import { createSelector } from 'reselect';
import { validateSelectorParams } from '@shopgate/pwa-common/helpers/data';
import {
  getProductState,
  getCurrentProduct,
  getProductCurrency,
} from '../selectors/product';

/**
 * Retrieves the product options state.
 * @param {Object} state The application state.
 * @returns {Object} The product options state.
 */
const getProductOptionsState = createSelector(
  getProductState,
  state => state.optionsByProductId
);

/**
 * Finds a product option item by the option id and item id.
 * @param {Object} options All available options.
 * @param {Object} optionId The Id of the option.
 * @param {Object} itemId The Id of the item.
 * @returns {Object}
 */
const findProductOptionItem = (options, optionId, itemId) => (
  options
    .find(opt => opt.id === optionId)
    .values
    .find(item => item.id === itemId)
);

/**
 * Retrieves the current products options.
 * @param {Object} state The application state.
 * @returns {Object} The product options.
 */
export const getRawProductOptions = createSelector(
  (state, props) => props.productId,
  getProductOptionsState,
  (productId, productOptionsState) => {
    const productOptions = productOptionsState[productId];

    if (!productOptions || productOptions.isFetching) {
      return null;
    }

    return productOptions.options;
  }
);

// TODO: This needs to be optimized!
const getOptionItems = createSelector(
  options => options,
  (options, values) => values,
  (options, values, option) => option,
  (options, values, option, selected) => selected,
  (options, values, option, selected, currency) => currency,
  (options, values = [], option, selected, currency) => values.map((value) => {
    // Add prices to each item that are relative to the current total product price.
    if (!selected) {
      return {
        label: value.label,
        currency,
        value: value.id,
        price: value.unitPriceModifier,
      };
    }

    const selectedItem = findProductOptionItem(options, option.id, selected);

    return {
      label: value.label,
      currency,
      value: value.id,
      price: (value.unitPriceModifier - selectedItem.unitPriceModifier),
    };
  })
);

/**
 * Retrieves the current products options and transforms it to the correct data structure.
 * @param {Object} state The application state.
 * @returns {Array} The product options.
 */
export const getProductOptions = createSelector(
  getProductCurrency,
  (state, props) => props.options,
  getRawProductOptions,
  validateSelectorParams((currency, currentOptions, options) => (
    options.map(option => ({
      id: option.id,
      label: option.label,
      type: option.type,
      items: getOptionItems(options, option.values, option, currentOptions[option.id], currency),
    }))
  ))
);

/**
 * Checks if the product has any options.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const hasProductOptions = createSelector(
  getCurrentProduct,
  (product) => {
    if (!product) {
      return false;
    }

    return product.flags.hasOptions;
  }
);

/**
 * Checks if all product options for the product are set
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const areProductOptionsSet = createSelector(
  getRawProductOptions,
  (state, props) => props.options,
  validateSelectorParams((options, currentOptions) => (
    options.length === Object.keys(currentOptions).length
  ))
);
