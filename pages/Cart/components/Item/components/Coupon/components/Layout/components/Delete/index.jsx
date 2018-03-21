import React from 'react';
import PropTypes from 'prop-types';
import CrossIcon from 'Components/icons/CrossIcon';
import styles from './style';

/**
 * The Coupon Delete component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Delete = ({ handleDelete }) => (
  <button className={styles} onClick={handleDelete}>
    <CrossIcon />
  </button>
);

Delete.propTypes = {
  handleDelete: PropTypes.func,
};

Delete.defaultProps = {
  handleDelete: () => {},
};

export default Delete;
