import React from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import { themeConfig } from '@shopgate/engage';
import {
  NavDrawer, DescriptionIcon, Icon, SurroundPortals,
} from '@shopgate/engage/components';
import {
  NAV_MENU_QUICK_LINKS,
  NAV_MENU_QUICK_LINKS_ITEMS,
} from '@shopgate/engage/core';
import portalProps from '../../portalProps';

import connect from './connector';

const { icons } = themeConfig;

/**
 * @param {Array} props.links An array of quicklinks.
 * @param {Function} props.navigate The navigate function.
 * @returns {JSX}
 */
const QuickLinks = ({ links, navigate }) => (
  (links && links.length > 0) && (
    <SurroundPortals portalName={NAV_MENU_QUICK_LINKS} portalProps={portalProps}>
      <NavDrawer.Section>
        <SurroundPortals portalName={NAV_MENU_QUICK_LINKS_ITEMS} portalProps={portalProps}>
          {links.map((link) => {
            let icon = DescriptionIcon;

            // Convert /page/some-link to pageSomeLink for custom icons
            const path = camelCase(link.url);
            if (icons[path]) {
              icon = props => <Icon content={icons[path]} {...props} />;
            }

            return (
              <NavDrawer.Item
                key={link.url}
                label={link.label}
                onClick={() => navigate(link.url, link.label)}
                icon={icon}
              />
            );
          })}
        </SurroundPortals>
      </NavDrawer.Section>
    </SurroundPortals>
  )
);

QuickLinks.propTypes = {
  navigate: PropTypes.func.isRequired,
  links: PropTypes.arrayOf(PropTypes.shape()),
};

QuickLinks.defaultProps = {
  links: [],
};

export default connect(QuickLinks);
