import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';
/**
 * Container component.
 * @param {Object} props Props.
 * @returns {function}
 */
const Container = props => (
  <div className={styles.container}>
    {props.children}
  </div>
);

Container.prototype.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};
Container.prototype.defaultProps = {
  children: [],
};

export default Container;
