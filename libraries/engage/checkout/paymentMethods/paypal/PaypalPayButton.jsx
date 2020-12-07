import React, {
  useLayoutEffect, useEffect, useRef, useState, Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { isIOSTheme } from '@shopgate/engage/core';
import { i18n } from '../../../core/helpers/i18n';
import { useCheckoutContext } from '../../hooks/common';
import { usePaypal } from './sdk';

const { colors } = themeConfig;

const styles = {
  headline: css({
    color: colors.shade3,
    fontSize: '1.25rem',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    margin: '12px 0 12px 0',
    ...(!isIOSTheme() ? {
      color: 'var(--color-text-high-emphasis)',
      textTransform: 'none',
    } : {}),
  }).toString(),
};

/**
 * Paypal Pay button
 * @returns {JSX}
 */
const PaypalPayButton = ({ disabled, onSubmit, onValidate }) => {
  const { paymentData, paymentTransactions } = useCheckoutContext();
  const [paypalActions, setPaypalActions] = useState(null);
  const paypal = usePaypal();
  const paypalButton = useRef(null);
  const button = useRef(null);
  const fundingSource = paymentData?.meta;

  // Store form actions inside ref as they would trigger
  // rerenders everytime the form changes, but here we
  // only need them once validating.
  // paypal unfortunately doesn't allow updating button props.
  const formActions = useRef({});
  useEffect(() => {
    formActions.current = { onSubmit, onValidate };
  }, [onSubmit, onValidate]);

  // Trigger rendering the paypal button whenever a property changes.
  useLayoutEffect(() => {
    if (!paypal) return;
    if (typeof fundingSource === 'object') return;
    if (paypalButton.current) {
      paypalButton.current.close();
    }

    paypalButton.current = paypal.Buttons({
      fundingSource: fundingSource || paypal.FUNDING.PAYPAL,
      createOrder: () => {
        const externalCode = paymentTransactions[0]?.externalCode;
        return externalCode;
      },
      onInit: (_, actions) => {
        // Here again thanks paypal, there is no way access the actions outside these handlers.
        setPaypalActions(actions);
      },
      onClick: (_, actions) => {
        // Trigger manual form validation to comply to paypal standards.
        const isValid = formActions.current.onValidate();
        if (isValid && !disabled) {
          return actions.resolve();
        }
        return actions.reject();
      },
      onApprove: () => {
        formActions.current.onSubmit();
      },
      style: {
        label: 'buynow',
        color: 'white',
      },
    });
    paypalButton.current.render(button.current);
  }, [disabled, fundingSource, paymentTransactions, paypal]);

  // Sync our internal disabled state with paypals disabled state.
  useEffect(() => {
    if (!paypalActions) return;

    if (disabled) {
      paypalActions.disable();
      return;
    }
    paypalActions.enable();
  }, [disabled, paypalActions]);

  if (typeof fundingSource === 'object') return null;

  if (!paypal) {
    return null;
  }

  return (
    <Fragment>
      <h3 className={styles.headline}>{i18n.text('checkout.finalizePayment')}</h3>
      <div ref={button} />
    </Fragment>
  );
};

PaypalPayButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
};

export default PaypalPayButton;
