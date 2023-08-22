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
    if (!property.displayGroup) {
      // Do not proceed when not displayGroup is available
      return;
    }

    let key = property.displayGroup;
    let label = null;

    if (property.displayGroup === 'custom') {
      key = `${property.displayGroup}-${property.customDisplayGroupName}`;

      if (property.customDisplayGroupName) {
        label = property.customDisplayGroupName;
      }
    }

    // Check if the groups array already contains a group with the key
    let existingGroup = groups.find(group => group.key === key);

    if (!existingGroup) {
      // Add a new group storage when there isn't one already
      existingGroup = {
        key,
        label,
        properties: [],
      };

      groups.push(existingGroup);
    }

    // Add current property to the storage
    existingGroup.properties.push(property);
  });

  return groups.map(group => ({
    ...group,
    // Check if the current group just contains html properties to allow special handling
    htmlOnly: group.properties.length ? group.properties.every(({ type }) => type === 'html') : false,
  }));
}
