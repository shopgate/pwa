import React, { Fragment, useCallback } from 'react';
import classNames from 'classnames';
import { Grid, ResponsiveContainer } from '@shopgate/engage/components';
import {
  ROPIS,
  BOPIS,
} from '../../constants';
import { i18n } from '../../../core';
import { isProductAvailable } from '../../helpers';
import { ChangeLocationButton } from '../ChangeLocationButton';
import { StockInfo } from '../StockInfo';
import { FulfillmentSelectorImpossibleError } from './FulfillmentSelectorImpossibleError';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { container, unavailable, locationName } from './FulfillmentSelectorLocation.style';
import {
  itemRow, itemColumn, itemSpacer,
} from './FulfillmentSelectorItem.style';

/**
 * The FulfillmentSelectorLocation component
 * @returns {JSX}
 */
export function FulfillmentSelectorLocation() {
  const {
    selection,
    preferredLocation,
    selectedLocation,
    inventory,
    handleChange,
    isReady,
    isROPISEnabled,
    isBOPISEnabled,
    userFulfillmentMethod,
    productId,
  } = useFulfillmentSelectorState();

  const usedLocation = selectedLocation || preferredLocation;
  const selected = ([ROPIS, BOPIS].includes(selection));
  const isOrderable = isProductAvailable(usedLocation || {}, inventory || {});

  const handleChangeLocation = useCallback(() => {
    if (selected) {
      handleChange(userFulfillmentMethod, true);
    }
  }, [handleChange, selected, userFulfillmentMethod]);

  if (!isReady) {
    return null;
  }

  const isRopeMethodEnabled = (isROPISEnabled || isBOPISEnabled);

  return (
    <Fragment>
      {(isRopeMethodEnabled && isOrderable && usedLocation) && (
        <Grid className={classNames(itemRow, container)} component="div">
          <ResponsiveContainer appAlways breakpoint="xs">
            <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
              <div className={locationName}>{usedLocation.name}</div>
              <ChangeLocationButton onClick={handleChangeLocation} disabled={!selected} />
            </Grid.Item>
            <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
              <StockInfo productId={productId} location={usedLocation} />
            </Grid.Item>
          </ResponsiveContainer>
          <ResponsiveContainer webOnly breakpoint=">xs">
            <div>
              <div className={locationName}>{usedLocation.name}</div>
              <ChangeLocationButton onClick={handleChangeLocation} disabled={!selected} />
            </div>
            <div className={itemSpacer}>
              <StockInfo productId={productId} location={usedLocation} />
            </div>
          </ResponsiveContainer>
        </Grid>
      )}
      {(isRopeMethodEnabled && selected && !isOrderable) && (
        <div className={container}>
          <div className={locationName}>{usedLocation?.name || ''}</div>
          <FulfillmentSelectorImpossibleError />
          <ChangeLocationButton onClick={handleChangeLocation} />
        </div>
      )}
      {!isRopeMethodEnabled && (
        <div className={classNames(unavailable, container)}>
          {i18n.text('locations.no_available')}
        </div>
      )}
    </Fragment>
  );
}
