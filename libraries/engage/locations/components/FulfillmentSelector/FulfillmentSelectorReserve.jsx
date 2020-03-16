// @flow
import React from 'react';
import classNames from 'classnames';
import { i18n } from '../../../core';
import { IN_STORE_PICKUP_LABEL, IN_STORE_PICKUP } from '../../constants';
import { StockInfo } from '../StockInfo';
import { ChangeLocationButton } from '../ChangeLocationButton';
import { itemRow, itemColumn } from './FulfillmentSelectorItem.style';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { container } from './FulfillmentSelectorReserve.style';

/**
 * Renders the reservation item label.
 * @returns {JSX}
 */
export function FulfillmentSelectorReserve() {
  const { location, selectedLocation, handleChange } = useFulfillmentSelectorState();
  const usedLocation = selectedLocation || location;

  const handleChangeLocation = React.useCallback(() => {
    handleChange(IN_STORE_PICKUP, true);
  }, [handleChange]);

  return (
    <React.Fragment>
      <div>
        {i18n.text(IN_STORE_PICKUP_LABEL)}
      </div>
      {usedLocation && (
        <div className={classNames(itemRow.toString(), container.toString())}>
          <div className={itemColumn}>
            <div>{usedLocation.name}</div>
            <ChangeLocationButton onClick={handleChangeLocation} />
          </div>
          <div className={itemColumn}>
            <StockInfo location={usedLocation} />
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
