import React, { Fragment } from 'react';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import connect from './connector';

/**
 * @param {Array} props.links An array of quicklinks.
 * @param {Function} props.navigate The navigate function.
 * @returns {JSX}
 */
const QuickLinks = ({ links, navigate }) => (
  (links && links.length > 0) && (
    <Fragment>
      <NavDrawer.Divider />
      {links.map(link => (
        <NavDrawer.Item
          key={link.url}
          label={link.label}
          onClick={() => navigate(link.url, link.label)}
        />
      ))}
    </Fragment>
  )
);

export default connect(QuickLinks);
