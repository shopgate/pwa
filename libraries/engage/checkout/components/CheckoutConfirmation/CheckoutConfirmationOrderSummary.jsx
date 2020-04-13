import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core/helpers/i18n';
import CheckoutConfirmationSection from './CheckoutConfirmationSection';
import connect from './CheckoutConfirmationOrderSummary.connector';

/**
 * CheckoutConfirmationOrderSummary component
 * @returns {JSX}
 */
const CheckoutConfirmationOrderSummary = ({ taxLines }) => {
  const content = useMemo(() => taxLines
    .filter(t => t.visible)
    .map(t => ({
      label: i18n.text(`checkout.summary.${t.type}`),
      text: i18n.price(t.value, t.currencyCode, 2),
    })), [taxLines]);

  return (
    <CheckoutConfirmationSection title="checkout.success.order_summary" content={content} />
  );
};

CheckoutConfirmationOrderSummary.propTypes = {
  taxLines: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default connect(CheckoutConfirmationOrderSummary);
