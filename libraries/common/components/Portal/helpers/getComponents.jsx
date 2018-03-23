import React from 'react';
import portalCollection from '../../../helpers/portals/portalCollection';
import { componentsConfig as config } from '../../../helpers/config';

const portals = portalCollection.getPortals();

/**
 * Matches the portal components to a portal name.
 * @param {string} name The name of the portal.
 * @param {Object} props The props to pass to the portal components.
 * @returns {Array}
 */
const getComponents = (name, props) => {
  const components = [];

  if (!config || !config.portals) {
    return components;
  }

  // Loop over the portal keys.
  Object.keys(config.portals).forEach((key, index) => {
    const portalTarget = [].concat(config.portals[key].target);

    if (portalTarget.length === 0) {
      return;
    }

    portalTarget.forEach((target) => {
      // Stop if there is no key that matches the given name (prop).
      if (target !== name) {
        return;
      }

      const PortalComponent = portals[key];

      // Check that the component is valid.
      if (!PortalComponent) {
        return;
      }

      const componentKey = `${key}-${index}`;
      components.push((
        <PortalComponent {...props} key={componentKey} />
      ));
    });
  });

  return components;
};

export default getComponents;
