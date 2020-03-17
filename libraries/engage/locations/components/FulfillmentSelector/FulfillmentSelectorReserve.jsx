// @flow
import React from 'react';
import classNames from 'classnames';
import { Grid } from '@shopgate/engage/components';
import { i18n } from '../../../core';
import { isProductAvailable } from '../../helpers';
import { IN_STORE_PICKUP_LABEL, IN_STORE_PICKUP, ROPIS } from '../../constants';
import { StockInfo } from '../StockInfo';
import { ChangeLocationButton } from '../ChangeLocationButton';
import { FulfillmentSelectorImpossibleError } from './FulfillmentSelectorImpossibleError';
import { itemRow, itemColumn } from './FulfillmentSelectorItem.style';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { container, unavailable } from './FulfillmentSelectorReserve.style';

/**
 * Renders the reservation item label.
 * @returns {JSX}
 */
export function FulfillmentSelectorReserve() {
  const {
    selection,
    location,
    selectedLocation,
    handleChange,
    productFulfillmentMethods,
  } = useFulfillmentSelectorState();
  const usedLocation = selectedLocation || location;
  const enabled = productFulfillmentMethods && productFulfillmentMethods.includes(ROPIS);
  const selected = (selection === IN_STORE_PICKUP);
  const isOrderable = isProductAvailable(location || undefined);

  const handleChangeLocation = React.useCallback(() => {
    handleChange(IN_STORE_PICKUP, true);
  }, [handleChange]);

  return (
    <React.Fragment>
      <div>
        {i18n.text(IN_STORE_PICKUP_LABEL)}
      </div>
      {(isOrderable && enabled && usedLocation) && (
        <Grid className={classNames(itemRow, container.toString())} component="div">
          <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
            <div>{usedLocation.name}</div>
            <ChangeLocationButton onClick={handleChangeLocation} />
          </Grid.Item>
          <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
            <StockInfo location={usedLocation} />
          </Grid.Item>
        </Grid>
      )}
      {(enabled && selected && !isOrderable) && (
        <React.Fragment>
          <FulfillmentSelectorImpossibleError />
          <ChangeLocationButton onClick={handleChangeLocation} />
        </React.Fragment>

      )}
      {!enabled && (
        <div className={unavailable}>
          {i18n.text('locations.no_available')}
        </div>
      )}
    </React.Fragment>
  );
}
