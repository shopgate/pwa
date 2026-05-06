import React from 'react';
import PropTypes from 'prop-types';
import { CrossIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  button: {
    padding: 0,
    fontSize: '1.5rem',
    marginTop: -2,
    marginRight: -5,
  },
});
/**
 * The Coupon Delete component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
export const CartItemCouponDelete = ({ handleDelete }) => {
  const { classes } = useStyles();

  return (
    <button
      className={classes.button}
      onClick={handleDelete}
      data-test-id="deleteCoupon"
      type="button"
      aria-label={i18n.text('cart.delete_coupon')}
    >
      <CrossIcon />
    </button>
  );
};

CartItemCouponDelete.propTypes = {
  handleDelete: PropTypes.func,
};

CartItemCouponDelete.defaultProps = {
  handleDelete: () => { },
};
