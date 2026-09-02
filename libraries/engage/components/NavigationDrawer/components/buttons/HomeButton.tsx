import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import HomeIcon from '@shopgate/pwa-ui-shared/icons/HomeIcon';
import { NAV_MENU_HOME } from '@shopgate/pwa-common/constants/Portals';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';

const LABEL = 'navigation.home';

/**
 * Renders the home entry of the navigation drawer.
 * @returns The rendered entry.
 */
const HomeButton = () => {
  const navigate = useNavDrawerNavigate();

  return (
    <SurroundPortals portalName={NAV_MENU_HOME} portalProps={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={HomeIcon}
        onClick={navigate(INDEX_PATH, LABEL)}
        testId="navDrawerHomeButton"
      />
    </SurroundPortals>
  );
};

export default HomeButton;
