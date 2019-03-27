import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '../Portal';
import { AFTER, BEFORE } from '../../constants/Portals';

/**
 * The Portal component.
 * @param {string} base portal (center) name
 * @param {Object} portalProps for portals
 * @param {Function} children children
 * @returns {JSX}
 */
const SurroundPortals = ({ portalName, children, portalProps }) => (
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
