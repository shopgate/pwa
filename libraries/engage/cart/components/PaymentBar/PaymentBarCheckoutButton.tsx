import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { CART_CHECKOUT_BUTTON } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { Button } from '@shopgate/engage/components/v2';
import { CHECKOUT_PATH } from '@shopgate/engage/checkout/constants';
import { getGrandTotal, getOrderableStatus } from '@shopgate/pwa-common-commerce/cart/selectors';
import { CartContext } from '../../cart.context';

export interface PaymentBarCheckoutButtonProps {
  /** Whether the label carries the grand total. */
  showTotal?: boolean;
}

/** The part of the cart context the button reads; `hideTotal` is an untyped config property. */
interface CheckoutButtonCartContext {
  isLoading: boolean;
  currency: string;
  config?: { hideTotal?: boolean };
}

/**
 * Renders the cart payment bar checkout button.
 * @returns The checkout button.
 */
const PaymentBarCheckoutButton = ({ showTotal = false }: PaymentBarCheckoutButtonProps) => {
  const isOrderable = useSelector(getOrderableStatus);
  const grandTotal = useSelector(getGrandTotal);
  const {
    isLoading, currency, config: { hideTotal } = {},
  } = useContext(CartContext) as CheckoutButtonCartContext;
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

export default PaymentBarCheckoutButton;
