import React from 'react';
import PropTypes from 'prop-types';
import { CrossIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import styles from './style';

/**
 * The Coupon Delete component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Delete = ({ handleDelete }) => (
  <button
    className={styles}
    onClick={handleDelete}
    data-test-id="deleteCoupon"
    type="button"
    aria-label={i18n.text('cart.delete_coupon')}
  >
    <CrossIcon />
  </button>
);

Delete.propTypes = {
  handleDelete: PropTypes.func,
};

Delete.defaultProps = {
  handleDelete: () => { },
};

export default Delete;
