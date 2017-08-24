import React, { PropTypes } from 'react';
import styles from './style';

/**
 * Renders a loading indicator
 * @param {Object} props the component properties
 * @returns {JSX}
 */
const LoadingIndicator = props => (
  <div className={styles}>
    {props.children}
  </div>
);

LoadingIndicator.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoadingIndicator;
