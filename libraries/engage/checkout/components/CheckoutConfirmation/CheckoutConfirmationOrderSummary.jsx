import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core/helpers/i18n';
import CheckoutConfirmationSection from './CheckoutConfirmationSection';
import { getCheckoutTaxLinesFromOrder } from '../../helpers';

/**
 * CheckoutConfirmationOrderSummary component
 * @returns {JSX}
 */
const CheckoutConfirmationOrderSummary = ({ order, className }) => {
  const content = useMemo(() => getCheckoutTaxLinesFromOrder(order)
    .filter(t => t.visible)
    .map(t => ({
      label: i18n.text(`checkout.summary.${t.type}`),
      text: i18n.price(t.value, t.currencyCode, 2),
    })), [order]);

  return (
    <CheckoutConfirmationSection
      title="checkout.success.order_summary"
      content={content}
      isSummary
      className={className}
    />
  );
};

CheckoutConfirmationOrderSummary.propTypes = {
  order: PropTypes.shape().isRequired,
  className: PropTypes.string,
};

CheckoutConfirmationOrderSummary.defaultProps = {
  className: null,
};

export default CheckoutConfirmationOrderSummary;
