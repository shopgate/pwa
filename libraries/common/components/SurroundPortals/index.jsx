import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '../Portal';
import { AFTER, BEFORE } from '../../constants/Portals';

/**
 * The SurroundPortals component renders three Portal component. The main portal is wrapped around
 * its children, the two additional portals are rendered before and after the main portal.
 * The names of the additional portals are automatically created from the name of the main portal
 * with a ".before" and ".after" suffix.
 *
 * @param {Object} props The component props
 * @param {string} props.portalName Name for the main portal
 * @param {Object} props.portalProps Props that are assigned to the portals
 * @param {React.ReactNode} props.children Component children
 * @returns {JSX.Element}
 */
const SurroundPortals = ({ portalName, portalProps, children }) => (
  <Fragment>
    <Portal name={`${portalName}.${BEFORE}`} props={portalProps} />
    <Portal name={portalName} props={portalProps}>
      {children}
    </Portal>
    <Portal name={`${portalName}.${AFTER}`} props={portalProps} />
  </Fragment>
);

SurroundPortals.propTypes = {
  portalName: PropTypes.string.isRequired,
  children: PropTypes.node,
  portalProps: PropTypes.shape(),
};

SurroundPortals.defaultProps = {
  children: null,
  portalProps: null,
};

export default SurroundPortals;
