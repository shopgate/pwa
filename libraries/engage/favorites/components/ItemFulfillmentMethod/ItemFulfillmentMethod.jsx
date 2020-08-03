import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { SheetList, SheetDrawer } from '@shopgate/engage/components';

/**
 * @param {Object} props Props.
 * @returns {JSX}
 */
const ItemFulfillmentMethod = ({ isOpen, methods, onClose }) => (
  <SheetDrawer
    isOpen={isOpen}
    title={i18n.text('favorites.fo_method_chooser.title')}
    onDidClose={() => onClose(null)}
  >
    <SheetList>
      {methods.includes('ROPIS') ? (
        <SheetList.Item
          title={i18n.text('locations.method.ropis')}
          onClick={() => onClose('ROPIS')}
        />
      ) : null}
      {methods.includes('BOPIS') ? (
        <SheetList.Item
          title={i18n.text('locations.method.bopis')}
          onClick={() => onClose('BOPIS')}
        />
      ) : null}
      {methods.includes('directShip') ? (
        <SheetList.Item
          title={i18n.text('locations.method.direct_ship')}
          onClick={() => onClose('directShip')}
        />
      ) : null}
    </SheetList>
  </SheetDrawer>
);

ItemFulfillmentMethod.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  methods: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ItemFulfillmentMethod;
