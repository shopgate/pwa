import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { SheetList, SheetDrawer } from '@shopgate/engage/components';

/**
 * @param {Object} props Props.
 * @returns {JSX}
 */
const ItemFulfillmentMethod = ({
  isOpen, methods, onClose, onSelect,
}) => (
  <SheetDrawer
    isOpen={isOpen}
    title={i18n.text('favorites.fo_method_chooser.title')}
    onDidClose={() => onClose(null)}
  >
    <SheetList>
      {methods.includes('ROPIS') ? (
        <SheetList.Item
          title={i18n.text('locations.method.ropis')}
          onClick={() => onSelect('ROPIS')}
        />
      ) : null}
      {methods.includes('BOPIS') ? (
        <SheetList.Item
          title={i18n.text('locations.method.bopis')}
          onClick={() => onSelect('BOPIS')}
        />
      ) : null}
      {methods.includes('directShip') ? (
        <SheetList.Item
          title={i18n.text('locations.method.direct_ship')}
          onClick={() => onSelect('directShip')}
        />
      ) : null}
    </SheetList>
  </SheetDrawer>
);

ItemFulfillmentMethod.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  methods: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ItemFulfillmentMethod;
