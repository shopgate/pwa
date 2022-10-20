import React from 'react';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  NAV_MENU_QUICK_LINKS,
} from '@shopgate/pwa-common/constants/Portals';
import portalProps from '../../portalProps';
import connect from './connector';
/**
 * @param {Array} props.links An array of quicklinks.
 * @param {Function} props.navigate The navigate function.
 * @returns {JSX}
 */
const QuickLinks = ({ links, navigate }) => (
  (links && links.length > 0) && (
    <SurroundPortals portalName={NAV_MENU_QUICK_LINKS} portalProps={portalProps}>
      <NavDrawer.Section>
        {links.map(link => (
          <NavDrawer.Item
            key={link.url}
            label={link.label}
            onClick={() => navigate(link.url, link.label)}
          />
        ))}
      </NavDrawer.Section>
    </SurroundPortals>

  )
);

export default connect(QuickLinks);
