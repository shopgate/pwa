import React from 'react';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  QUICK_LINKS_CONTENT,
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
    <SurroundPortals portalName={QUICK_LINKS_CONTENT} portalProps={portalProps}>
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
