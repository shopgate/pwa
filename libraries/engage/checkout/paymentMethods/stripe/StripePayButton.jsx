import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core/helpers/i18n';
import { useCheckoutContext } from '../../hooks/common';
import { prepareStripeRequestCheckout } from './StripeProvider';
import { getSdk } from './sdk';

/**
 * Paypal Pay button
 * @returns {JSX}
 */
const StripePayButton = ({
  children, disabled, onSubmit, onValidate,
}) => {
  const { order, paymentData, setLocked } = useCheckoutContext();
  const { stripeRequest, stripeRequestType } = paymentData?.meta || {};

  if (!stripeRequestType || !stripeRequestType?.applePay) {
    return children;
  }

  /* eslint-disable react/button-has-type */
  return (
    <button
      disabled={disabled}
      lang={i18n.getLang()}
      onClick={() => {
        // Make sure button can't be triggered when loading
        if (!onValidate() || disabled) {
          return;
        }

        // Trigger stripe on client.
        setLocked(true);
        prepareStripeRequestCheckout(getSdk(), stripeRequest, order)
          .then((event) => {
            stripeRequest.preparedEvent = event;
            onSubmit();
          })
          .catch(() => {
            setLocked(false);
          });
      }}
      style={{
        WebkitAppearance: '-apple-pay-button',
        ApplePayButtonType: 'buy',
        height: 40,
      }}
    >
      {' '}
    </button>
  );
  /* eslint-enable react/button-has-type */
};

StripePayButton.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
};

export default StripePayButton;
