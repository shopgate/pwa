import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import LogoutIcon from '@shopgate/pwa-ui-shared/icons/LogoutIcon';
import logoutAction from '@shopgate/pwa-common/actions/user/logout';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import { NAV_MENU_LOGOUT } from '@shopgate/pwa-common/constants/Portals';
import portalProps from '../portalProps';
import { useThunkDispatch } from '../hooks';

/**
 * Renders the logout entry of the navigation drawer.
 * @returns The rendered entry.
 */
const LogoutButton = () => {
  const dispatch = useThunkDispatch();
  const isLoggedIn = useSelector(isUserLoggedIn);
  const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <NavDrawer.Section>
      <SurroundPortals portalName={NAV_MENU_LOGOUT} portalProps={portalProps}>
        <NavDrawer.Item
          label="navigation.logout"
          icon={LogoutIcon}
          onClick={logout}
          testId="navDrawerLogOutButton"
        />
      </SurroundPortals>
    </NavDrawer.Section>
  );
};

export default LogoutButton;
