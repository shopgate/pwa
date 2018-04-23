import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Card = ({ children, style, tag: Tag }) => (
  <Tag className={styles} style={style}>
    {children}
  </Tag>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.shape(),
  tag: PropTypes.string,
};

Card.defaultProps = {
  style: {},
  tag: 'div',
};

export default Card;
