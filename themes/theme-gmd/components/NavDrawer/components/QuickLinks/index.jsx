import React from 'react';
import camelCase from 'lodash/camelCase';
import { themeConfig } from '@shopgate/engage';
import { NavDrawer, DescriptionIcon, Icon } from '@shopgate/engage/components';
import connect from './connector';

const { icons } = themeConfig;

/**
 * @param {Array} props.links An array of quicklinks.
 * @param {Function} props.navigate The navigate function.
 * @returns {JSX}
 */
const QuickLinks = ({ links, navigate }) => (
  (links && links.length > 0) && (
    <NavDrawer.Section>
      {links.map((link) => {
        let icon = DescriptionIcon;

        // Convert /page/some-link to pageSomeLink for custom icons
        const path = camelCase(link.url);
        if (icons[path]) {
          icon = props => <Icon content={icons[path]} {...props} />;
        }

        return (
          <NavDrawer.Item
            aria-hidden
            key={link.url}
            label={link.label}
            onClick={() => navigate(link.url, link.label)}
            icon={icon}
          />
        );
      })}
    </NavDrawer.Section>
  )
);

export default connect(QuickLinks);
