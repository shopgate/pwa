import React, {
  Fragment, useLayoutEffect, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { useCheckoutContext } from '../../hooks/common';
import Button from '../../components/PaymentMethodButton';
import { loadWebSdk, usePaypal } from './sdk';

const styles = {
  button: css({
    ' .paypal-mark': {
      ' img': {
        height: 25,
        background: 'transparent',
      },
      background: 'transparent',
      border: 'none',
      margin: 0,
      padding: 0,
    },
  }).toString(),
};

/**
 * Paypal
 * @param {Object} props Props
 * @returns {JSX}
 */
const PaypalButton = ({
  settings, onChange, activePaymentMeta: activeFundingSource, active,
}) => {
  const { setLocked } = useCheckoutContext();
  const paypal = usePaypal();

  // Intialize paypal sdk.
  useEffect(() => {
    if (!settings) return;
    /** Async handler */
    const handler = async () => {
      setLocked(true);
      await loadWebSdk(settings);
      setLocked(false);
    };
    handler();
  }, [setLocked, settings]);

  // Create paypal markers (just logic-less logos for each payment method).
  const marks = useMemo(() => {
    if (!paypal) return [];
    return paypal.getFundingSources().map((fundingSource) => {
      const mark = window.paypal.Marks({
        fundingSource,
      });
      if (!mark.isEligible()) return null;
      return [mark, fundingSource];
    }).filter(m => !!m);
  }, [paypal]);

  // Render markes to dom once ready.
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      marks.forEach(([mark], index) => {
        mark.render(`#sg-paypal-button-${index}`);
      });
    }, []);
  }, [marks]);

  return (
    <Fragment>
      {marks.map(([, fundingSource], index) => {
        const isButtonActive = fundingSource === paypal.FUNDING.PAYPAL && !activeFundingSource
          ? active
          : active && fundingSource === activeFundingSource;

        return (
          <Button
            key={fundingSource}
            onChange={() => onChange(fundingSource)}
            active={isButtonActive}
          >
            <div id={`sg-paypal-button-${index}`} className={styles.button} />
          </Button>
        );
      })}
    </Fragment>
  );
};

PaypalButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  /* eslint-disable-next-line react/forbid-prop-types */
  activePaymentMeta: PropTypes.any,
  settings: PropTypes.shape(),
};

PaypalButton.defaultProps = {
  settings: null,
  activePaymentMeta: null,
};

export default PaypalButton;
