import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The manufacturer component.
 * @param {Object} props The component props.
 * @param {string} props.text The manufacturer name.
 * @param {string} [props.className] CSS classes.
 * @return {JSX}
 */
const Manufacturer = ({ className, text }) => (
  <div className={`${styles} ${className} ui-shared__manufacturer`}>
    <span dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);

Manufacturer.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Manufacturer.defaultProps = {
  className: '',
};

export default Manufacturer;
