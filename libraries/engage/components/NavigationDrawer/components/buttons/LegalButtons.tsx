import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import Icon from '@shopgate/pwa-common/components/Icon';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import {
  makeGetMenu,
  NAV_MENU_IMPRINT,
  NAV_MENU_PRIVACY,
  NAV_MENU_TERMS,
} from '@shopgate/engage/core';
import { LEGAL_MENU } from '@shopgate/pwa-common/constants/MenuIDs';
import { NAV_MENU_RETURN_POLICY } from '@shopgate/pwa-common-commerce/market/constants/Portals';
import {
  IMPRINT_PATH,
  PRIVACY_PATH,
  RETURN_POLICY_PATH,
  TERMS_PATH,
} from '@shopgate/engage/page/constants';
import { ConditionalWrapper } from '../../../ConditionalWrapper';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';

const { icons = {} } = themeConfig as { icons?: Record<string, string> };

const pagePortalMapping: Record<string, string> = {
  [IMPRINT_PATH]: NAV_MENU_IMPRINT,
  [PRIVACY_PATH]: NAV_MENU_PRIVACY,
  [RETURN_POLICY_PATH]: NAV_MENU_RETURN_POLICY,
  [TERMS_PATH]: NAV_MENU_TERMS,
};

const pageTestIdMapping: Record<string, string> = {
  [IMPRINT_PATH]: 'navDrawerImprintButton',
  [PRIVACY_PATH]: 'navDrawerPrivacyButton',
  [RETURN_POLICY_PATH]: 'navDrawerReturnsButton',
  [TERMS_PATH]: 'navDrawerTermsButton',
};

type LegalPage = {
  /** Route the entry navigates to. */
  url: string;
  /** Entry label. */
  label: string;
  /** Name of the configured theme icon. */
  icon?: string;
};

/**
 * Builds an icon renderer for a legal menu entry.
 * @param icon The configured icon name.
 * @returns The icon component.
 */
const getIcon = (icon?: string) => (props: Record<string, unknown>) => (
  <Icon {...props} content={(icon && icons[icon]) || icons.description} />
);

/**
 * Renders the legal pages provided by the legal menu.
 * @returns The rendered entries.
 */
const LegalButtons = () => {
  const navigate = useNavDrawerNavigate();
  const getMenu = useMemo(() => makeGetMenu(LEGAL_MENU), []);
  const legalPages = useSelector(
    getMenu as (state: object) => LegalPage[] | null
  );

  if (!legalPages) {
    return null;
  }

  return (
    <>
      {legalPages.map(({ url, label, icon }) => (
        <ConditionalWrapper
          key={url}
          condition={!!pagePortalMapping[url]}
          wrapper={(children: React.ReactNode) => (
            <SurroundPortals portalName={pagePortalMapping[url]} portalProps={portalProps}>
              {children}
            </SurroundPortals>
          )}
        >
          <NavDrawer.Item
            label={label}
            icon={getIcon(icon)}
            onClick={navigate(url, label)}
            testId={pageTestIdMapping[url] || null}
          />
        </ConditionalWrapper>
      ))}
    </>
  );
};

export default LegalButtons;
