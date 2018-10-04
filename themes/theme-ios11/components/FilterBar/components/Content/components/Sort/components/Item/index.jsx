import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * Renders the Sort component.
 * @param {Object} props The components props.
 * @returns {JSX}
 */
const Item = ({ children }) => (
  <div className={styles}>
    {children}
  </div>
);

Item.propTypes = {
  children: PropTypes.node,
};

Item.defaultProps = {
  children: null,
};

export default Item;
