import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * Wraps a single fiter page item.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FilterItem = ({ children }) => (
  <div className={styles}>
    {children}
  </div>
);

FilterItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FilterItem;
