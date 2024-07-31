import React from 'react';
import PropTypes from 'prop-types';
import {
  SurroundPortals,
} from '@shopgate/engage/components';
import {
  NAV_MENU_QUICK_LINKS,
  NAV_MENU_QUICK_LINKS_ITEMS,
} from '@shopgate/engage/core/constants';
import portalProps from '../../portalProps';

import Section from '../Section';
import connect from './connector';

/**
 * The Quicklinks component.
 * @param {Object} props The component props.
 * @param {Array} props.entries The quicklinks.
 * @returns {JSX}
 */
function Quicklinks({ entries }) {
  if (!entries || !entries.length) {
    return null;
  }

  return (
    <SurroundPortals portalName={NAV_MENU_QUICK_LINKS} portalProps={portalProps}>
      <Section title="navigation.more_menu">
        <SurroundPortals portalName={NAV_MENU_QUICK_LINKS_ITEMS} portalProps={portalProps}>
          {entries.map(entry => (
            <Section.Item href={entry.url} key={entry.url} label={entry.label} />
          ))}
        </SurroundPortals>
      </Section>
    </SurroundPortals>
  );
}

Quicklinks.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape()),
};

Quicklinks.defaultProps = {
  entries: null,
};

export default connect(Quicklinks);
