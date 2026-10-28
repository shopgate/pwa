import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import SecurityIcon from '@shopgate/pwa-ui-shared/icons/SecurityIcon';
import { NAV_MENU_PRIVACY_SETTINGS } from '@shopgate/engage/core';
import { PRIVACY_SETTINGS_PATTERN } from '@shopgate/engage/tracking/constants';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';

const LABEL = 'navigation.privacySettings';

/**
 * Renders the privacy settings entry of the navigation drawer.
 * @returns The rendered entry.
 */
const PrivacySettingsButton = () => {
  const navigate = useNavDrawerNavigate();

  return (
    <SurroundPortals portalName={NAV_MENU_PRIVACY_SETTINGS} portalProps={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={SecurityIcon}
        onClick={navigate(`${PRIVACY_SETTINGS_PATTERN}?source=settings`, LABEL)}
        testId="navDrawerPrivacySettingsButton"
      />
    </SurroundPortals>
  );
};

export default PrivacySettingsButton;
