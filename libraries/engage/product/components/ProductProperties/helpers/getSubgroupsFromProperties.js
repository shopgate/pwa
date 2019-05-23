/**
 * Collects all display sub-groups from the properties.
 * @param {Array} [properties=null] The properties to parse.
 * @returns {Array}
 */
export function getSubgroupsFromProperties(properties = null) {
  const subgroups = [];

  if (properties === null) {
    return subgroups;
  }

  properties.forEach((property) => {
    if (property.subDisplayGroup && !subgroups.includes(property.subDisplayGroup)) {
      subgroups.push(property.subDisplayGroup);
    }
  });

  return subgroups;
}
