/**
 * Retrieves the properties for a specific subDisplayGroup.
 * @param {Array} properties The properties to filter.
 * @param {string} group The group to look for.
 * @returns {Array}
 */
export function getPropertiesBySubgroup(properties, group) {
  return properties
    .filter(({ subDisplayGroup }) => subDisplayGroup === group);
}
