// @flow
import React from 'react';
import classNames from 'classnames';
import { Grid } from '@shopgate/engage/components';
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
  const {
    location,
    selectedLocation,
    handleChange,
  } = useFulfillmentSelectorState();
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
    </React.Fragment>
  );
}
