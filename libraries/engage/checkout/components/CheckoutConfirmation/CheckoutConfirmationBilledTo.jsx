import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
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

    const [payment = {}] = order.paymentTransactions || [{}];
    const { paymentInfo: { card: { type, last4 } = {} } = {} } = payment;

    const hasPayment = order.paymentTransactions && order.paymentTransactions[0];

    const address = [
      `${firstName} ${lastName}`,
      `${address1 || ''}`,
      `${city ? `${city},` : ''} ${city && region ? region : ''} ${postalCode || ''}`,
    ].filter(Boolean).join('\n\r');

    return [
      ...(hasPayment ? [
        {
          label: i18n.text('checkout.success.card_holder'),
          text: address,
        },
      ] : [
        {
          label: i18n.text('checkout.success.address'),
          text: address,
        },
      ]),
      ...(hasPayment ? [
        {
          label: i18n.text('checkout.success.payment_method'),
          text: `${startCase(type)} **** **** ${last4}`,
        },
      ] : []),
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
