import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import BarcodeScannerIcon from '@shopgate/pwa-ui-shared/icons/BarcodeScannerIcon';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { useSelector } from 'react-redux';
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
} from '@shopgate/pwa-core/constants/Scanner';
import { NAV_MENU_SCANNER } from '@shopgate/pwa-common/constants/Portals';
import { getScannerRoute } from '@shopgate/pwa-common-commerce/scanner/helpers';
import { hasScannerSupport } from '@shopgate/pwa-common/selectors/client';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';

const { hasNoScanner } = appConfig as { hasNoScanner?: boolean };

const LABEL = 'navigation.scanner';

/**
 * Renders the scanner entry of the navigation drawer.
 * @returns The rendered entry.
 */
const ScannerButton = () => {
  const navigate = useNavDrawerNavigate();
  const supported = useSelector(
    (state: object) => !hasNoScanner && hasScannerSupport(state)
  );

  return (
    <SurroundPortals portalName={NAV_MENU_SCANNER} portalProps={portalProps}>
      {supported && (
        <NavDrawer.Item
          label={LABEL}
          icon={BarcodeScannerIcon}
          onClick={navigate(getScannerRoute(SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE), LABEL)}
          testId="navDrawerScannerButton"
        />
      )}
    </SurroundPortals>
  );
};

export default ScannerButton;
