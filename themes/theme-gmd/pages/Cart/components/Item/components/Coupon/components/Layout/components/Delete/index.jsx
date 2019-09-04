import React from 'react';
import PropTypes from 'prop-types';
import CrossIcon from '@shopgate/pwa-ui-shared/icons/CrossIcon';
import styles from './style';

/**
 * The Coupon Delete component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Delete = ({ handleDelete }) => (
  <button className={styles} onClick={handleDelete} data-test-id="deleteCoupon" type="button">
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
