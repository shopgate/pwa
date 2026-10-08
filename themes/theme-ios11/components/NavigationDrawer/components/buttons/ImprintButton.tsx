import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import InfoIcon from '@shopgate/pwa-ui-shared/icons/InfoIcon';
import { NAV_MENU_IMPRINT } from '@shopgate/engage/core';
import { IMPRINT_PATH } from '@shopgate/engage/page/constants';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';

const LABEL = 'navigation.about';

/**
 * Renders the imprint entry of the navigation drawer.
 * @returns The rendered entry.
 */
const ImprintButton = () => {
  const navigate = useNavDrawerNavigate();

  return (
    <SurroundPortals portalName={NAV_MENU_IMPRINT} portalProps={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={InfoIcon}
        onClick={navigate(IMPRINT_PATH, LABEL)}
        testId="navDrawerImprintButton"
      />
    </SurroundPortals>
  );
};

export default ImprintButton;
