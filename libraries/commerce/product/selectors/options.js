import { createSelector } from 'reselect';
import { validateSelectorParams } from '@shopgate/pwa-common/helpers/data';
import {
  getProduct,
  getProductId,
  getProductState,
  getProductCurrency,
} from '../selectors/product';
import { OPTION_TYPE_SELECT, OPTION_TYPE_TEXT } from '../constants';

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
  getProductId,
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
        // Price modifier and difference are equal, when nothing is selected.
        price: value.unitPriceModifier,
        priceDifference: value.unitPriceModifier,
      };
    }

    const {
      unitPriceModifier: siblingPrice = 0,
    } = findProductOptionItem(options, option.id, selected);

    return {
      label: value.label,
      currency,
      value: value.id,
      // Price which affects the unit price.
      price: value.unitPriceModifier,
      // Difference to the currently selected sibling.
      priceDifference: (value.unitPriceModifier - siblingPrice),
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
  (state, props = {}) => props.currentOptions,
  getRawProductOptions,
  validateSelectorParams((currency, currentOptions, options) => (
    options.map(option => ({
      id: option.id,
      label: option.label,
      type: option.type,
      value: currentOptions[option.id],
      ...option.type === OPTION_TYPE_SELECT && {
        items: getOptionItems(options, option.values, option, currentOptions[option.id], currency),
      },
      ...option.type === OPTION_TYPE_TEXT && {
        info: option.annotation,
        required: !!option.required,
        price: option.unitPriceModifier,
      },
    }))
      // Move select type options on top, keep the rest
      .sort((a, b) => {
        if (a.type === b.type) {
          return 0;
        }
        if (a.type === 'select') {
          return -1;
        }
        return b.type === 'select' ? 1 : 0;
      })
  ))
);

/**
 * Checks if the product has any options.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const hasProductOptions = createSelector(
  getProduct,
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
  (state, props = {}) => props.options || false,
  validateSelectorParams((options, currentOptions) => (
    options.length === Object.keys(currentOptions).length
  ))
);
