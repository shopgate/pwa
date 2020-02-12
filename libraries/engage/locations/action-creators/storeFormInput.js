import { STORE_FORM_INPUT } from '../constants';

/**
 * Creates the dispatched STORE_FORM_INPUT action object.
 * @param {Object} input The user form input.
 * @returns {Object}
 */
const storeFormInput = input => ({
  type: STORE_FORM_INPUT,
  input,
});

export default storeFormInput;
