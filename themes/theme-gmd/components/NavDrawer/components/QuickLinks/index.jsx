import React from 'react';
import { NavDrawer } from '@shopgate/engage/components';
import connect from './connector';

/**
 * @param {Array} props.links An array of quicklinks.
 * @param {Function} props.navigate The navigate function.
 * @returns {JSX}
 */
const QuickLinks = ({ links, navigate }) => (
  (links && links.length > 0) && (
    <NavDrawer.Section>
      {links.map(link => (
        <NavDrawer.Item
          key={link.url}
          label={link.label}
          onClick={() => navigate(link.url, link.label)}
        />
      ))}
    </NavDrawer.Section>
  )
);

export default connect(QuickLinks);
