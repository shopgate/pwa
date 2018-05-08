import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The price info component
 * @param {Object} props The component props
 * @param {string} props.text The price info string e.g. 12,00 € / l
 * @param {string} [props.className] CSS classes
 * @return {JSX}
 */
const PriceInfo = ({ className, text }) => (
  <div
    className={`${styles} ${className}`}
    dangerouslySetInnerHTML={{ __html: text }}
  />
);

PriceInfo.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

PriceInfo.defaultProps = {
  className: '',
};

export default PriceInfo;
