import React, {
  Fragment, useLayoutEffect, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { useCheckoutContext } from '../../hooks/common';
import Button from '../../components/PaymentMethodButton';
import { loadWebSdk, usePaypal } from './sdk';

const useStyles = makeStyles()({
  button: {
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
  },
});

/**
 * Paypal
 * @param {Object} props Props
 * @returns {JSX}
 */
const PaypalButton = ({
  settings, onChange, activePaymentMeta: activeFundingSource, active,
}) => {
  const { classes } = useStyles();
  const { setLocked, order } = useCheckoutContext();
  const paypal = usePaypal();

  // Initialize paypal sdk.
  useEffect(() => {
    if (!settings || !order) return;
    /** Async handler */
    const handler = async () => {
      setLocked(true);
      try {
        await loadWebSdk(settings, order);
      } catch (e) {
        //
      }
      setLocked(false);
    };
    handler();
  }, [order, setLocked, settings]);

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

  // Render marks to dom once ready.
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      marks.forEach(([mark], index) => {
        mark.render(`#sg-paypal-button-${index}`);
      });
    }, []);
  }, [marks]);

  return (
    <>
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
            <div id={`sg-paypal-button-${index}`} className={classes.button} />
          </Button>
        );
      })}
    </>
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
