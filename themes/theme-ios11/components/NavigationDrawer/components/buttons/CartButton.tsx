import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import ShoppingCartIcon from '@shopgate/pwa-ui-shared/icons/ShoppingCartIcon';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import { useSelector } from 'react-redux';
import { NAV_MENU_CART } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { getCartProductCount } from '@shopgate/pwa-common-commerce/cart/selectors';
import { i18n } from '@shopgate/engage/core/helpers';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';
import CartBadge from '../badges/CartBadge';

const LABEL = 'navigation.cart';

/**
 * Renders the cart entry of the navigation drawer.
 * @returns The rendered entry.
 */
const CartButton = () => {
  const navigate = useNavDrawerNavigate();
  const count = useSelector(getCartProductCount);

  return (
    <SurroundPortals portalName={NAV_MENU_CART} portalProps={portalProps}>
      <NavDrawer.Item
        badge={CartBadge}
        label={LABEL}
        aria-label={`${i18n.text(LABEL)}. ${i18n.text('common.products')}: ${count}.`}
        icon={ShoppingCartIcon}
        onClick={navigate(CART_PATH, LABEL)}
        testId="navDrawerCartButton"
      />
    </SurroundPortals>
  );
};

export default CartButton;
