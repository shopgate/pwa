import { createSelector } from 'reselect';
import { validateSelectorParams } from '@shopgate/pwa-common/helpers/data';
import { getCurrentProductId, getCurrentProduct, getProductCurrency } from '../selectors/product';

/**
 * Retrieves the product options state.
 * @param {Object} state The application state.
 * @returns {Object} The product options state.
 */
const getProductOptionsState = state => state.product.optionsByProductId;

/**
 * Retrieves the current options for the active product.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCurrentProductOptions = state => state.product.currentProduct.options;

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
  getProductOptionsState,
  getCurrentProductId,
  (productOptionsState, productId) => {
    const productOptions = productOptionsState[productId];
    if (!productOptions || productOptions.isFetching) {
      return null;
    }
    return productOptions.options;
  }
);

/**
 * Retrieves the current products options and transforms it to the correct data structure.
 * @param {Object} state The application state.
 * @returns {Array} The product options.
 */
export const getProductOptions = createSelector(
  getProductCurrency,
  getCurrentProductOptions,
  getRawProductOptions,
  validateSelectorParams((currency, currentOptions, options) => (
    options.map((option) => {
      const selected = currentOptions[option.id];

      return {
        id: option.id,
        label: option.label,
        type: option.type,
        items: (option.values || []).map(({ id, label, unitPriceModifier }) => {
          // Add prices to each item that are relative to the current total product price.
          if (!selected) {
            return {
              label,
              currency,
              value: id,
              price: unitPriceModifier,
            };
          }

          const selectedItem = findProductOptionItem(options, option.id, selected);
          return {
            label,
            currency,
            value: id,
            price: unitPriceModifier - selectedItem.unitPriceModifier,
          };
        }),
      };
    })
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
  getCurrentProductOptions,
  validateSelectorParams((options, currentOptions) => (
    options.length === Object.keys(currentOptions).length
  ))
);
