import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import LocalShippingIcon from '@shopgate/pwa-ui-shared/icons/LocalShippingIcon';
import { NAV_MENU_SHIPPING } from '@shopgate/pwa-common-commerce/market/constants/Portals';
import { SHIPPING_PATH } from '@shopgate/engage/page/constants';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';

const LABEL = 'navigation.shipping';

/**
 * Renders the shipping information entry of the navigation drawer.
 * @returns The rendered entry.
 */
const ShippingButton = () => {
  const navigate = useNavDrawerNavigate();

  return (
    <SurroundPortals portalName={NAV_MENU_SHIPPING} portalProps={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={LocalShippingIcon}
        onClick={navigate(SHIPPING_PATH, LABEL)}
        testId="navDrawerShippingButton"
      />
    </SurroundPortals>
  );
};

export default ShippingButton;
