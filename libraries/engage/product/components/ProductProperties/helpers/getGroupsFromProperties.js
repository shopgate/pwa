/**
 * Collects all display groups from the properties.
 * @param {Array} [properties=null] The properties to parse.
 * @returns {Array}
 */
export function getGroupsFromProperties(properties = null) {
  const groups = [];

  if (properties === null) {
    return groups;
  }

  properties.forEach((property) => {
    if (property.displayGroup && !groups.includes(property.displayGroup)) {
      groups.push(property.displayGroup);
    }
  });

  return groups;
}
