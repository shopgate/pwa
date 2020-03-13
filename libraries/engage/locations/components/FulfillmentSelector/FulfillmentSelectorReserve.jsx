// @flow
import React from 'react';
import classNames from 'classnames';
import { i18n } from '../../../core';
import { IN_STORE_PICKUP_LABEL } from '../../constants';
import { itemRow, itemColumn } from './FulfillmentSelectorItem.style';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { container } from './FulfillmentSelectorReserve.style';

/**
 * Renders the reservation item label.
 * @returns {JSX}
 */
export function FulfillmentSelectorReserve() {
  const { location, selectedLocation } = useFulfillmentSelectorState();
  const usedLocation = selectedLocation || location;

  return (
    <React.Fragment>
      <div>
        {i18n.text(IN_STORE_PICKUP_LABEL)}
      </div>
      {usedLocation && (
        <div className={classNames(itemRow.toString(), container.toString())}>
          <div className={itemColumn}>
            {usedLocation.name}
          </div>
          <div className={itemColumn}>
            in stock
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
