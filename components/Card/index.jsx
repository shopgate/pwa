import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * Renders the card component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Card = ({ className, children }) => (
  <div className={`${styles} ${className}`}>
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.defaultProps = {
  className: '',
};

export default Card;
