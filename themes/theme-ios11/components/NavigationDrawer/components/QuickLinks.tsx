import { useMemo } from 'react';
import camelCase from 'lodash/camelCase';
import { useSelector } from 'react-redux';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import Icon from '@shopgate/pwa-common/components/Icon';
import DescriptionIcon from '@shopgate/pwa-ui-shared/icons/DescriptionIcon';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { QUICKLINKS_MENU } from '@shopgate/pwa-common/constants/MenuIDs';
import {
  makeGetMenu,
  NAV_MENU_QUICK_LINKS,
  NAV_MENU_QUICK_LINKS_ITEMS,
} from '@shopgate/engage/core';
import { useNavDrawerNavigate } from '../hooks';
import portalProps from '../portalProps';

const { icons = {} } = themeConfig as { icons?: Record<string, string> };

type QuickLink = {
  /** Route the entry navigates to. */
  url: string;
  /** Entry label. */
  label: string;
};

/**
 * Renders the configured quick links section.
 * @returns The rendered section.
 */
const QuickLinks = () => {
  const navigate = useNavDrawerNavigate();
  const getMenu = useMemo(() => makeGetMenu(QUICKLINKS_MENU), []);
  const links = useSelector(getMenu as (state: object) => QuickLink[] | null);

  if (!links?.length) {
    return null;
  }

  return (
    <SurroundPortals portalName={NAV_MENU_QUICK_LINKS} portalProps={portalProps}>
      <NavDrawer.Section>
        <SurroundPortals portalName={NAV_MENU_QUICK_LINKS_ITEMS} portalProps={portalProps}>
          {links.map(({ url, label }) => {
            const custom = icons[camelCase(url)];

            return (
              <NavDrawer.Item
                key={url}
                label={label}
                onClick={navigate(url, label)}
                icon={custom
                  ? (props: Record<string, unknown>) => <Icon content={custom} {...props} />
                  : DescriptionIcon}
              />
            );
          })}
        </SurroundPortals>
      </NavDrawer.Section>
    </SurroundPortals>
  );
};

export default QuickLinks;
