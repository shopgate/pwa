/**
 * Pass in an element and its CSS Custom Property that you want the value of.
 * Optionally, you can determine what datatype you get back.
 *
 * @param {string} key The key of the custom property
 * @param {HTMLElement} [element=document.documentElement] The target HTML element
 * @param {string} [castAs='string'] Type for optional casting
 * @returns {*}
 */
export const getCSSCustomProp = (key, element = document.documentElement, castAs = 'string') => {
  let response = getComputedStyle(element).getPropertyValue(key);

  // Tidy up the string if there's something to work with
  if (response.length) {
    response = response.replace(/'|"/g, '').trim();
  }

  // Convert the response into a whatever type we wanted
  switch (castAs) {
    case 'number':
    case 'int':
      return parseInt(response, 10);
    case 'float':
      return parseFloat(response, 10);
    case 'boolean':
    case 'bool':
      return response === 'true' || response === '1';
    default:
      return response;
  }
};

/**
 * Sets the value of an CSS custom property.
 * @param {string} key The key of the custom property
 * @param {string} value The new value of the custom property
 * @param {HTMLElement} [element=document.documentElement] The target HTML element
 */
export const setCSSCustomProp = (key, value, element = document.documentElement) => {
  const style = getComputedStyle(element);

  if (style.getPropertyValue(key) !== value) {
    style.setProperty(key, value);
  }
};
