import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PayPalRiskCheck } from '@shopgate/native-modules';
import { makeStyles } from '@shopgate/engage/styles';
import { useCheckoutContext } from '../../hooks/common';
import Button from '../../components/PaymentMethodButton';
import paypalLogoUrl from './paypal_logo.png';

const useStyles = makeStyles()({
  logo: {
    width: '60%',
  },
});

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const PaypalButtonApp = (props) => {
  const { classes } = useStyles();
  const { settings } = props;
  const { setLocked } = useCheckoutContext();

  useEffect(() => {
    if (!settings) return;
    /** Async handler */
    const handler = async () => {
      if (PayPalRiskCheck?.setup) {
        setLocked(true);
        try {
          await PayPalRiskCheck.setup(settings.env === 'sandbox');
        } catch (e) {
          //
        }
        setLocked(false);
      }
    };

    handler();
  }, [setLocked, settings]);

  return (
    <Button {...props}>
      <img
        className={classes.logo}
        src={paypalLogoUrl}
        alt="PayPal"
      />
    </Button>
  );
};

PaypalButtonApp.propTypes = {
  settings: PropTypes.shape(),
};

PaypalButtonApp.defaultProps = {
  settings: null,
};

export default PaypalButtonApp;
