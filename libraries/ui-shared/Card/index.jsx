import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * Renders the card component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Card = ({ className, children, id }) => (
  <div className={`${styles} ${className}`} id={id}>
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
};

Card.defaultProps = {
  className: '',
  id: null,
};

export default Card;
