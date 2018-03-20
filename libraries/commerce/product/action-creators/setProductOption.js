import { SET_PRODUCT_OPTION } from '../constants';

/**
 * Dispatches the SET_PRODUCT_OPTION action.
 * @param {string} optionId The ID of the option.
 * @param {string} valueId The ID of the selected value.
 * @return {Object} The SET_PRODUCT_OPTIONS action.
 */
const setProductOption = (optionId, valueId) => ({
  type: SET_PRODUCT_OPTION,
  optionId,
  valueId,
});

export default setProductOption;
