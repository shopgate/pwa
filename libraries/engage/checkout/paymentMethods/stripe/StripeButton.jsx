import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import Button from '../../components/PaymentMethodButton';
import { i18n } from '../../../core';
import { loadSdk } from './sdk';
import { useCheckoutContext } from '../../hooks/common';
import connect from './StripeButton.connector';
import googlePayLogo from './googlepay.png';
import applePayLogo from './applepay.svg';

const styles = {
  mark: css({
    height: 32,
  }).toString(),
};

/**
 * Stripe Payment Button Component
 * @param {Object} props Props
 * @param {string} props.publishableKey Publishable Key
 * @param {Function} props.onChange onChange handler
 * @param {boolean} props.active Whether the method is active
 * @param {Object} props.activePaymentMeta Active payment meta
 * @returns {JSX}
 */
const StripeButton = ({
  publishableKey,
  onChange,
  active,
  activePaymentMeta: subMethod,
  ...props
}) => {
  const [stripeRequest, setStripeRequest] = useState(null);
  const [stripeRequestType, setStripeRequestType] = useState(null);
  const { order } = useCheckoutContext();

  useEffect(() => {
    if (!publishableKey) {
      return;
    }
    /** */
    const fn = async () => {
      if (!order) {
        return;
      }
      const stripe = await loadSdk(publishableKey);
      const req = stripe.paymentRequest({
        country: order.addressSequences?.[0]?.country,
        currency: order.currencyCode.toLowerCase(),
        total: {
          label: 'Checkout',
          amount: Math.round(order.total * 100),
        },
      });
      const availability = await req.canMakePayment();
      if (!availability) {
        return;
      }
      setStripeRequest(req);
      setStripeRequestType(availability);
    };
    fn();
  }, [order, publishableKey]);

  return (
    <>
      <Button {...props} onChange={() => onChange(null)} active={active && !subMethod}>
        {i18n.text('checkout.payment.buttons.stripe')}
      </Button>
      {stripeRequest && stripeRequestType?.applePay ? (
        <Button
          {...props}
          active={!!(active && subMethod)}
          onChange={() => onChange({
            stripeRequest,
            stripeRequestType,
          })}
        >
          <img className={styles.mark} alt="ApplePay" src={applePayLogo} />
        </Button>
      ) : null}
      {stripeRequest && !stripeRequestType?.applePay ? (
        <Button
          {...props}
          active={!!(active && subMethod)}
          onChange={() => onChange({
            stripeRequest,
            stripeRequestType,
          })}
        >
          <img className={styles.mark} alt="GooglePay" src={googlePayLogo} />
        </Button>
      ) : null}
    </>
  );
};

StripeButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  activePaymentMeta: PropTypes.shape(),
  publishableKey: PropTypes.string,
};
StripeButton.defaultProps = {
  publishableKey: null,
  activePaymentMeta: null,
};
export default connect(StripeButton);
