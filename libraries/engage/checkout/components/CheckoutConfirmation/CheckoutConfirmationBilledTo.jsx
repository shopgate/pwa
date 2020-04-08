import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core/helpers/i18n';
import CheckoutConfirmationSection from './CheckoutConfirmationSection';

/**
 * CheckoutConfirmationBilledTo component
 * @returns {JSX}
 */
const CheckoutConfirmationBilledTo = ({ order }) => {
  const content = useMemo(() => {
    const billing = order.addressSequences.find(address => address.type === 'billing');
    const {
      firstName, lastName, address1, city, region, postalCode,
    } = billing;

    const [payment] = order.paymentTransactions;
    const { paymentInfo: { card: { type, last4 } = {} } = {} } = payment;

    return [
      {
        label: i18n.text('checkout.success.card_holder'),
        text: `${firstName} ${lastName}`,
      },
      {
        label: i18n.text('checkout.success.address'),
        text: [`${address1}`, `${city}, ${region} ${postalCode}`].join('\n\r'),
      },
      {
        label: i18n.text('checkout.success.payment_method'),
        text: `${type} ****${last4}`,
      },
    ];
  }, [order]);

  return (
    <CheckoutConfirmationSection title="checkout.success.billed_to" content={content} />
  );
};

CheckoutConfirmationBilledTo.propTypes = {
  order: PropTypes.shape().isRequired,
};

export default CheckoutConfirmationBilledTo;
