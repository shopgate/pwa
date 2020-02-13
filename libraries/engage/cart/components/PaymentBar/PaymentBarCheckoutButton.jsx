// @flow
import * as React from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Link';
import { SurroundPortals } from '@shopgate/engage/components';
import { CART_CHECKOUT_BUTTON } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CartContext } from '../../cart.context';
import connect from './PaymentBarCheckoutButton.connector';
import { button, disabledButton } from './PaymentBarCheckoutButton.style';

type Props = {
  isOrderable?: boolean;
}

/**
 * Renders the cart payment bar checkout button.
 * @param {boolean} isOrderable Whether the cart is orderable.
 * @return {JSX}
 */
function PaymentBarCheckoutButton({ isOrderable }: Props) {
  const { isLoading } = React.useContext(CartContext);
  const isActive = React.useMemo(() => (isOrderable && !isLoading), [isLoading, isOrderable]);

  return (
    <SurroundPortals portalName={CART_CHECKOUT_BUTTON} props={{ isActive }}>
      <Link href={CHECKOUT_PATH} disabled={!isActive}>
        <RippleButton
          disabled={!isActive}
          type="regular"
          className={isActive ? button : disabledButton}
        >
          <I18n.Text string="cart.checkout" />
        </RippleButton>
      </Link>
    </SurroundPortals>
  );
}

PaymentBarCheckoutButton.defaultProps = {
  isOrderable: true,
};

export default connect(PaymentBarCheckoutButton);
