import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import SecurityIcon from '@shopgate/pwa-ui-shared/icons/SecurityIcon';
import { NAV_MENU_PRIVACY } from '@shopgate/engage/core';
import { PRIVACY_PATH } from '@shopgate/engage/page/constants';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';

const LABEL = 'navigation.privacy';

/**
 * Renders the privacy policy entry of the navigation drawer.
 * @returns The rendered entry.
 */
const PrivacyButton = () => {
  const navigate = useNavDrawerNavigate();

  return (
    <SurroundPortals portalName={NAV_MENU_PRIVACY} portalProps={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={SecurityIcon}
        onClick={navigate(PRIVACY_PATH, LABEL)}
        testId="navDrawerPrivacyButton"
      />
    </SurroundPortals>
  );
};

export default PrivacyButton;
