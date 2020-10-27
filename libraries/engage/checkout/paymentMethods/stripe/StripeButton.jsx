import React from 'react';
import Button from '../../components/PaymentMethodButton';
import { i18n } from '../../../core/helpers/i18n';

/**
 * Stripe
 * @param {Object} props Props
 * @returns {JSX}
 */
const StripeButton = props => (
  <Button {...props}>
    {i18n.text('checkout.payment.buttons.stripe')}
  </Button>
);

export default StripeButton;
