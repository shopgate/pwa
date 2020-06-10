import React from 'react';
import PropTypes from 'prop-types';
import CheckoutConfirmationSection from './CheckoutConfirmationSection';

/**
 * CheckoutConfirmationPickupNotes component
 * @returns {JSX}
 */
const CheckoutConfirmationPickupNotes = ({ order, className }) => {
  if (!order.notes) {
    return null;
  }

  return (
    <CheckoutConfirmationSection
      title="checkout.success.pickup_notes"
      content={order.notes}
      className={className}
    />
  );
};

CheckoutConfirmationPickupNotes.propTypes = {
  order: PropTypes.shape().isRequired,
  className: PropTypes.string,
};

CheckoutConfirmationPickupNotes.defaultProps = {
  className: null,
};

export default CheckoutConfirmationPickupNotes;
