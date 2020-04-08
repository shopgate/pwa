import React from 'react';
import PropTypes from 'prop-types';
import CheckoutConfirmationSection from './CheckoutConfirmationSection';

/**
 * CheckoutConfirmationPickupNotes component
 * @returns {JSX}
 */
const CheckoutConfirmationPickupNotes = ({ order }) => {
  if (!order.notes) {
    return null;
  }

  return (
    <CheckoutConfirmationSection title="checkout.success.pickup_notes" content={order.notes} />
  );
};

CheckoutConfirmationPickupNotes.propTypes = {
  order: PropTypes.shape().isRequired,
};

export default CheckoutConfirmationPickupNotes;
