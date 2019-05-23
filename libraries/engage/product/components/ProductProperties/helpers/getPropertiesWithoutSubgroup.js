/**
 * Retrieves only the properties without a subDisplayGroup.
 * @param {Array} properties The properties to filter.
 * @return {Array}
 */
export function getPropertiesWithoutSubgroup(properties) {
  return properties
    .filter(({ subDisplayGroup }) => (!subDisplayGroup || subDisplayGroup === ''));
}
