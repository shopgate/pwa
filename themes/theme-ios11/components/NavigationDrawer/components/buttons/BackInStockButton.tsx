import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import NotificationIcon from '@shopgate/pwa-ui-shared/icons/NotificationIcon';
import { useSelector } from 'react-redux';
import {
  BACK_IN_STOCK_PATTERN,
  NAV_MENU_BACK_IN_STOCK,
} from '@shopgate/engage/back-in-stock/constants';
import { getIsBackInStockEnabled } from '@shopgate/engage/back-in-stock/selectors';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';
import BackInStockBadge from '../badges/BackInStockBadge';

const LABEL = 'navigation.back_in_stock';

/**
 * Renders the back in stock entry of the navigation drawer.
 * @returns The rendered entry.
 */
const BackInStockButton = () => {
  const navigate = useNavDrawerNavigate();
  const enabled = useSelector(getIsBackInStockEnabled);

  return (
    <SurroundPortals portalName={NAV_MENU_BACK_IN_STOCK} portalProps={portalProps}>
      {enabled && (
      <NavDrawer.Item
        badge={BackInStockBadge}
        label={LABEL}
        icon={NotificationIcon}
        aria-hidden
        onClick={navigate(BACK_IN_STOCK_PATTERN, LABEL)}
        testId="navDrawerBackInStockButton"
      />
      )}
    </SurroundPortals>
  );
};

export default BackInStockButton;
