import React, { useEffect } from 'react';
import { css } from 'glamor';
import PropTypes from 'prop-types';
import { PayPalRiskCheck } from '@shopgate/native-modules';
import { useCheckoutContext } from '../../hooks/common';
import Button from '../../components/PaymentMethodButton';
import paypalLogoUrl from './paypal_logo.png';

const styles = {
  logo: css({
    width: '60%',
  }).toString(),
};

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const PaypalButtonApp = (props) => {
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
        className={styles.logo}
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
