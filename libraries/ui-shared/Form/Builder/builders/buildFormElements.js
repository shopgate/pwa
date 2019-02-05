import { logger } from '@shopgate/pwa-core/helpers';
import { ELEMENT_TYPE_COUNTRY, ELEMENT_TYPE_PROVINCE } from '../elementTypes';

/** Noop function */
const noop = () => {};

/**
 * @typedef {Object} FormElement
 * @property {string} id
 * @property {boolean} custom
 * @property {function} handleChange
 * @property {number|null|undefined} sortOrder
 * @property {string} label
 * @property {string} type
 * @property {string|null|undefined} default
 * @property {string|null|undefined} placeholder
 * @property {boolean|null|undefined} required
 * @property {boolean|null|undefined} visible
 * @property {FormFieldAction[]|null|undefined} actions
 */

/**
 * Takes a list of which elements to render based on the respective element type
 *
 * @param {Form} formConfig Configuration of which form fields to render
 * @param {Function} elementChangeHandler change handler
 * @return {FormElement[]}
 */
export default (formConfig, elementChangeHandler = noop) => {
  /**
   * @type {FormElement[]}
   */
  const elementList = [];

  let hasCountryElement = false;
  let hasProvinceElement = false;

  /**
   * @param {string} id id
   * @param {AnyFormField} field field
   * @param {boolean} custom custom
   */
  const addFormElement = (id, field, custom = false) => {
    // The "custom" field is just a placeholder for more fields
    if (typeof field.type !== 'string') {
      return;
    }

    // Make sure country and province elements are only added once
    if (field.type === ELEMENT_TYPE_COUNTRY) {
      if (hasCountryElement) {
        logger.error(`Error: Can not add multiple elements of type '${field.type}'`);
        return;
      }
      hasCountryElement = true;
    }
    if (field.type === ELEMENT_TYPE_PROVINCE) {
      if (hasProvinceElement) {
        logger.error(`Error: Can not add multiple elements of type '${field.type}'`);
        return;
      }
      hasProvinceElement = true;
    }
    elementList.push({
      id,
      ...field,
      custom,
      handleChange: value => elementChangeHandler(id, value),
    });
  };

  // Extract custom fields, do not mix with normal fields
  const { custom, ...restFields } = formConfig.fields;

  // Add all non-custom attributes and mark them as such
  Object.keys(restFields).forEach((id) => {
    addFormElement(id, formConfig.fields[id]);
  });

  // Add custom fields to the element list
  if (custom) {
    Object.keys(custom).forEach((id) => {
      addFormElement(id, formConfig.fields.custom[id], true);
    });
  }

  return elementList;
};
