import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import BoxIcon from '@shopgate/pwa-ui-shared/icons/BoxIcon';
import { NAV_MENU_RETURN_POLICY } from '@shopgate/pwa-common-commerce/market/constants/Portals';
import { RETURN_POLICY_PATH } from '@shopgate/engage/page/constants';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';

const LABEL = 'navigation.returns';

/**
 * Renders the return policy entry of the navigation drawer.
 * @returns The rendered entry.
 */
const ReturnsButton = () => {
  const navigate = useNavDrawerNavigate();

  return (
    <SurroundPortals portalName={NAV_MENU_RETURN_POLICY} portalProps={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={BoxIcon}
        onClick={navigate(RETURN_POLICY_PATH, LABEL)}
        testId="navDrawerReturnsButton"
      />
    </SurroundPortals>
  );
};

export default ReturnsButton;
