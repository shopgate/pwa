import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * @returns {JSX}
 */
const FilterContentItem = ({ children }) => (
  <div className={styles}>
    {children}
  </div>
);

FilterContentItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FilterContentItem;
