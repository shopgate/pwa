import { ELEMENT_TYPE_CHECKBOX, ELEMENT_TYPE_SELECT } from '../Builder.constants';

/**
 * Prepare state of formData for form builder
 * @param {Object} formElements form elements
 * @param {Object} defaults form defaults
 * @returns {Object}
 */
export default (formElements = [], defaults = {}) => {
  const formDefaults = {};

  // Take only those defaults from props, that are actually represented by an element
  formElements.forEach((element) => {
    let defaultState = element.type === ELEMENT_TYPE_CHECKBOX ? false : '';

    if (element.type === ELEMENT_TYPE_SELECT && !element.default) {
      ([defaultState] = Object.keys(element.options));
    }

    // Use default from element config as a base
    if (element.default !== undefined && element.default !== null) {
      defaultState = element.default;
    }

    // Take defaults from "customAttributes" property or from the higher level, based on element
    if (element.custom && defaults.customAttributes !== undefined) {
      if (defaults.customAttributes[element.id] !== undefined) {
        defaultState = defaults.customAttributes[element.id];
      }
    } else if (!element.custom && defaults[element.id] !== undefined) {
      defaultState = defaults[element.id];
    }

    // Save default into the form state and into defaults property if one was set
    if (defaultState !== undefined) {
      formDefaults[element.id] = defaultState;
    }
  });

  return formDefaults;
};
