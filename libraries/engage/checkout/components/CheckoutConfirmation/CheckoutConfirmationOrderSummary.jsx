import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core/helpers/i18n';
import CheckoutConfirmationSection from './CheckoutConfirmationSection';

/**
 * CheckoutConfirmationOrderSummary component
 * @returns {JSX}
 */
const CheckoutConfirmationOrderSummary = ({ order }) => {
  const content = useMemo(() => {
    const { total, subTotal, currencyCode } = order;

    const entries = [];

    if (subTotal) {
      entries.push({
        label: i18n.text('checkout.summary.subTotal'),
        text: i18n.price(subTotal, currencyCode, 2),
      });
    }
    if (total) {
      entries.push({
        label: i18n.text('checkout.summary.total'),
        text: i18n.price(total, currencyCode, 2),
      });
    }

    return entries;
  }, [order]);

  return (
    <CheckoutConfirmationSection title="checkout.success.order_summary" content={content} />
  );
};

CheckoutConfirmationOrderSummary.propTypes = {
  order: PropTypes.shape().isRequired,
};

export default CheckoutConfirmationOrderSummary;
