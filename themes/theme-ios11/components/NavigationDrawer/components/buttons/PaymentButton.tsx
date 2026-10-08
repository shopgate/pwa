import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import CreditCardIcon from '@shopgate/pwa-ui-shared/icons/CreditCardIcon';
import { NAV_MENU_PAYMENT } from '@shopgate/pwa-common-commerce/market/constants/Portals';
import { PAYMENT_PATH } from '@shopgate/engage/page/constants';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';

const LABEL = 'navigation.payment';

/**
 * Renders the payment information entry of the navigation drawer.
 * @returns The rendered entry.
 */
const PaymentButton = () => {
  const navigate = useNavDrawerNavigate();

  return (
    <SurroundPortals portalName={NAV_MENU_PAYMENT} portalProps={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={CreditCardIcon}
        onClick={navigate(PAYMENT_PATH, LABEL)}
        testId="navDrawerPaymentButton"
      />
    </SurroundPortals>
  );
};

export default PaymentButton;
