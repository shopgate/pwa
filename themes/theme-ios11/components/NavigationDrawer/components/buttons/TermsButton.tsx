import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import DescriptionIcon from '@shopgate/pwa-ui-shared/icons/DescriptionIcon';
import { NAV_MENU_TERMS } from '@shopgate/engage/core';
import { TERMS_PATH } from '@shopgate/engage/page/constants';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';

const LABEL = 'navigation.terms';

/**
 * Renders the terms and conditions entry of the navigation drawer.
 * @returns The rendered entry.
 */
const TermsButton = () => {
  const navigate = useNavDrawerNavigate();

  return (
    <SurroundPortals portalName={NAV_MENU_TERMS} portalProps={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={DescriptionIcon}
        onClick={navigate(TERMS_PATH, LABEL)}
        testId="navDrawerTermsButton"
      />
    </SurroundPortals>
  );
};

export default TermsButton;
