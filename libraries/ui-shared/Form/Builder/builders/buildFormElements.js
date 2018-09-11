import { logger } from '@shopgate/pwa-core/helpers';
import { ELEMENT_TYPE_COUNTRY, ELEMENT_TYPE_PROVINCE } from '../elementTypes';

/**
 * Takes a list of which elements to render based on the respective element type
 *
 * @param {Form} formConfig Configuration of which form fields to render
 * @param {function} elementChangeHandler change handler
 * @return {FormElement[]}
 */
export default (formConfig, elementChangeHandler) => {
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
  const addFormElement = (id, field, custom) => {
    // The "custom" field is just a placeholder for more fields
    if (id === 'custom') {
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

  // Add all non-custom attributes and mark them as such
  Object.keys(formConfig.fields).forEach((id) => {
    addFormElement(id, formConfig.fields[id], false);
  });

  // Add custom fields to the element list
  if (formConfig.fields.custom) {
    Object.keys(formConfig.fields.custom).forEach((id) => {
      addFormElement(id, formConfig.fields.custom[id], true);
    });
  }

  return elementList;
};
