import React from 'react';
import PropTypes from 'prop-types';
import { I18n, SurroundPortals, RippleButton } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { CART_CHECKOUT_BUTTON } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { FulfillmentSheet, STAGE_RESERVE_FORM } from '../../../locations';
import { CartContext } from '../../cart.context';
import connect from './PaymentBarReserveButton.connector';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  button: {
    width: '100%',
    background: 'var(--color-button-cta)',
    color: 'var(--color-button-cta-contrast)!important',
  },
  disabledButton: {
    width: '100%',
    background: colors.shade7,
    color: `${colors.shade4}!important`,
  },
});

/**
 * The reserve button component.
 * @param {Object} props The component props.
 * @param {Function} props.historyReset The history reset function.
 * @return {JSX.Element} The rendered component.
 */
const PaymentBarReserveButton = ({ historyReset }) => {
  const { classes } = useStyles();
  const { flags: { orderable } } = React.useContext(CartContext);

  /**
   * Handles the click on the button.
   */
  const handleClick = React.useCallback(() => {
    FulfillmentSheet.open({
      stage: STAGE_RESERVE_FORM,
      callback: (_location, _product, orderSuccess) => {
        if (orderSuccess === true) {
          historyReset();
        }
      },
    });
  }, [historyReset]);

  return (
    <SurroundPortals portalName={CART_CHECKOUT_BUTTON} portalProps={{ isActive: orderable }}>
      <RippleButton
        onClick={handleClick}
        disabled={!orderable}
        type="regular"
        className={orderable ? classes.button : classes.disabledButton}
      >
        <I18n.Text string="cart.reserve" />
      </RippleButton>
    </SurroundPortals>
  );
};

PaymentBarReserveButton.propTypes = {
  historyReset: PropTypes.func.isRequired,
};

export default connect(PaymentBarReserveButton);
