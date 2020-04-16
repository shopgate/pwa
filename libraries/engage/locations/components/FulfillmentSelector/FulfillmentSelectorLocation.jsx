import React, { Fragment, useCallback } from 'react';
import classNames from 'classnames';
import { Grid } from '@shopgate/engage/components';
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
import { container, unavailable } from './FulfillmentSelectorLocation.style';
import { itemRow, itemColumn } from './FulfillmentSelectorItem.style';

/**
 * The FulfillmentSelectorLocation component
 * @returns {JSX}
 */
export function FulfillmentSelectorLocation() {
  const {
    selection,
    location,
    selectedLocation,
    handleChange,
    isReady,
    isROPISEnabled,
    isBOPISEnabled,
    userFulfillmentMethod,
  } = useFulfillmentSelectorState();

  const usedLocation = selectedLocation || location;
  const selected = ([ROPIS, BOPIS].includes(selection));
  const isOrderable = isProductAvailable(location || undefined);

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
          <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
            <div>{usedLocation.name}</div>
            <ChangeLocationButton onClick={handleChangeLocation} disabled={!selected} />
          </Grid.Item>
          <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
            <StockInfo location={usedLocation} />
          </Grid.Item>
        </Grid>
      )}
      {(isRopeMethodEnabled && selected && !isOrderable) && (
        <div className={container}>
          <div>{usedLocation.name}</div>
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
