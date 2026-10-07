import React, { useContext, useMemo } from 'react';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { CART_CHECKOUT_BUTTON } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { Button } from '@shopgate/engage/components/v2';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import PropTypes from 'prop-types';
import { CartContext } from '../../cart.context';
import connect from './PaymentBarCheckoutButton.connector';

/**
 * Renders the cart payment bar checkout button.
 * @param {Object} props The component props.
 * @param {boolean} props.isOrderable Whether the cart is orderable.
 * @param {number} props.grandTotal The grand total of the cart.
 * @param {boolean} props.showTotal Whether the label carries the grand total.
 * @return {JSX.Element}
 */
const PaymentBarCheckoutButton = ({ isOrderable, grandTotal, showTotal }) => {
  const { isLoading, currency, config: { hideTotal } = {} } = useContext(CartContext);
  const isActive = useMemo(() => (isOrderable && !isLoading), [isLoading, isOrderable]);
  const withTotal = showTotal && !hideTotal && !!currency && typeof grandTotal === 'number';

  return (
    <SurroundPortals portalName={CART_CHECKOUT_BUTTON} portalProps={{ isActive }}>
      <Button href={CHECKOUT_PATH} color="cta" fullWidth disabled={!isActive}>
        <I18n.Text string="cart.checkout" />
        {withTotal && (
          <>
            <span aria-hidden>{'\u00A0·\u00A0'}</span>
            <I18n.Price price={grandTotal} currency={currency} />
          </>
        )}
      </Button>
    </SurroundPortals>
  );
};

PaymentBarCheckoutButton.propTypes = {
  grandTotal: PropTypes.number,
  isOrderable: PropTypes.bool,
  showTotal: PropTypes.bool,
};

PaymentBarCheckoutButton.defaultProps = {
  grandTotal: null,
  isOrderable: true,
  showTotal: false,
};

export default connect(PaymentBarCheckoutButton);
