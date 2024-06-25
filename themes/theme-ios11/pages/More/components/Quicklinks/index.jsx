import React from 'react';
import PropTypes from 'prop-types';
import {
  SurroundPortals,
} from '@shopgate/engage/components';
import {
  NAV_MENU_QUICK_LINKS,
  NAV_MENU_QUICK_LINKS_ITEMS,
} from '@shopgate/pwa-common/constants/Portals';
import { BACK_IN_STOCK_PATTERN } from '@shopgate/engage/back-in-stock/constants';
import portalProps from '../../portalProps';

import Section from '../Section';
import connect from './connector';

/**
 * The Quicklinks component.
 * @param {Object} props The component props.
 * @param {Array} props.entries The quicklinks.
 * @param {boolean} props.isBackInStockEnabled Whether back in stock is enabled.
 * @returns {JSX}
 */
function Quicklinks({ entries, isBackInStockEnabled }) {
  const allEntries = isBackInStockEnabled ?
    [...entries, { url: BACK_IN_STOCK_PATTERN, label: 'navigation.back_in_stock', key: 'back_in_stock' }] :
    [...entries];

  if (!allEntries || !allEntries.length) {
    return null;
  }

  return (
    <SurroundPortals portalName={NAV_MENU_QUICK_LINKS} portalProps={portalProps}>
      <Section title="navigation.more_menu">
        <SurroundPortals portalName={NAV_MENU_QUICK_LINKS_ITEMS} portalProps={portalProps}>
          {allEntries.map(entry => (
            <Section.Item href={entry.url} key={entry.url} label={entry.label} />
          ))}
        </SurroundPortals>
      </Section>
    </SurroundPortals>
  );
}

Quicklinks.propTypes = {
  isBackInStockEnabled: PropTypes.bool.isRequired,
  entries: PropTypes.arrayOf(PropTypes.shape()),
};

Quicklinks.defaultProps = {
  entries: null,
};

export default connect(Quicklinks);
