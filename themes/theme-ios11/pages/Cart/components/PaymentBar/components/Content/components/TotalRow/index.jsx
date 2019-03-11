import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * @returns {JSX}
 */
const TotalRow = ({ children }) => (
  <div className={styles}>
    {children}
  </div>
);

TotalRow.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TotalRow;
