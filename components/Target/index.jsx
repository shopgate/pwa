import React from 'react';
import PropTypes from 'prop-types';
import last from 'lodash/last';
import portalCollection from '@shopgate/pwa-core/classes/PortalCollection';
import { componentsConfig as config } from '../../helpers/config';

const portals = portalCollection.getPortals();

/**
 * The Target component.
 * It renders out the portals relating to the ID prop.
 * @param {Object} props The component props.
 * @return {Array|null}
 */
const Target = ({ id, identifier, children }) => {
  const components = [];

  Object.keys(config.portals)
    .forEach((key) => {
      if (config.portals[key].target === id) {
        const PortalComponent = portals[key];
        components.push(<PortalComponent key={`${key}-${identifier}`} identifier={identifier} />);
      }
    });

  if (children && components.length) {
    return
  }

  if (components.length) {
    return last(components);
  }

  return children;
};

Target.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  identifier: PropTypes.string,
};

Target.defaultProps = {
  identifier: null,
  children: null,
};

export default Target;
