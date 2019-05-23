import React from 'react';
import PropTypes from 'prop-types';
import { Ripple } from '@shopgate/engage/components';
import styles from './style';

/**
 * Renders the Sort component.
 * @param {Object} props The components props.
 * @returns {JSX}
 */
const Item = ({ children }) => (
  <Ripple fill className={styles}>
    {children}
  </Ripple>
);

Item.propTypes = {
  children: PropTypes.node,
};

Item.defaultProps = {
  children: null,
};

export default Item;
