import React, { useCallback, useMemo } from 'react';
import intersection from 'lodash/intersection';
import { Grid, ResponsiveContainer, SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import {
  ROPIS,
  BOPIS,
  DIRECT_SHIP,
} from '../../constants';
import { i18n } from '../../../core';
import { isProductAvailable } from '../../helpers';
import { ChangeLocationButton } from '../ChangeLocationButton';
import { StockInfo } from '../StockInfo';
import { FulfillmentSelectorImpossibleError } from './FulfillmentSelectorImpossibleError';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { PRODUCT_FULFILLMENT_SELECTOR_LOCATION } from '../../constants/Portals';
import { FulfillmentSelectorLocationMethodNotAvailable } from './FulfillmentSelectorLocationMethodNotAvailable';
import FulfillmentSelectorAlternativeLocation from './FulfillmentSelectorAlternativeLocation';

const useStyles = makeStyles()(theme => ({
  container: {
    fontSize: '0.75rem',
    padding: theme.spacing(0, 2, 1, 6),
    marginTop: theme.spacing(-1),
    flexDirection: 'column',
  },
  unavailable: {
    color: themeColors.dark,
    fontSize: '0.625rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    opacity: 0.5,
  },
  locationName: {
    color: 'var(--color-text-medium-emphasis)',
  },
  itemRow: {
    alignContent: 'stretch',
    alignItems: 'baseline',
  },
  itemColumn: {
    display: 'block',
    width: '50%',
    '&:first-of-type': {
      paddingRight: theme.spacing(1),
    },
    '&:last-of-type': {
      textAlign: 'right',
    },
  },
  itemSpacer: {
    marginLeft: 16,
  },
}));

/**
 * The FulfillmentSelectorLocation component
 * @returns {JSX}
 */
export function FulfillmentSelectorLocation() {
  const { classes, cx } = useStyles();
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
    productFulfillmentMethods,
    shopFulfillmentMethods,
    locationFulfillmentMethods,
    useLocationFulfillmentMethods,
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

  const locationSupportsFulfillmentMethod = useMemo(() => {
    if (!useLocationFulfillmentMethods || !selected) {
      return true;
    }

    return (locationFulfillmentMethods).includes(userFulfillmentMethod);
  }, [locationFulfillmentMethods, selected, useLocationFulfillmentMethods, userFulfillmentMethod]);

  const selectionAvailableForProduct = useMemo(() => intersection(
    shopFulfillmentMethods || [],
    productFulfillmentMethods || []
  ).filter(entry => entry !== DIRECT_SHIP).includes(selection), [
    shopFulfillmentMethods,
    productFulfillmentMethods,
    selection,
  ]);

  if (!isReady || (preferredLocation && !inventory)) {
    return null;
  }
  const isRopeMethodEnabled = (isROPISEnabled || isBOPISEnabled || selectionAvailableForProduct);

  return (
    <>
      <SurroundPortals
        portalName={PRODUCT_FULFILLMENT_SELECTOR_LOCATION}
        portalProps={{
          productId,
          location: usedLocation,
          inventory,
        }}
      >
        {(isRopeMethodEnabled && isOrderable && usedLocation) && (
          <Grid className={cx(classes.itemRow, classes.container)} component="div">
            <Grid component="div">
              <ResponsiveContainer appAlways breakpoint="xs">
                <Grid.Item className={classes.itemColumn} grow={1} shrink={0} component="div">
                  <div className={classes.locationName}>{usedLocation.name}</div>
                </Grid.Item>
                <Grid.Item className={classes.itemColumn} grow={1} shrink={0} component="div">
                  <StockInfo productId={productId} location={usedLocation} />
                </Grid.Item>
              </ResponsiveContainer>
              <ResponsiveContainer webOnly breakpoint=">xs">
                <div>
                  <div className={classes.locationName}>{usedLocation.name}</div>
                </div>
                <div className={classes.itemSpacer}>
                  <StockInfo productId={productId} location={usedLocation} />
                </div>
              </ResponsiveContainer>
            </Grid>
            {selectionAvailableForProduct && !locationSupportsFulfillmentMethod ? (
              <FulfillmentSelectorLocationMethodNotAvailable method={userFulfillmentMethod} />
            ) : null}
            <ChangeLocationButton onClick={handleChangeLocation} disabled={!selected} />
          </Grid>
        )}
        {(isRopeMethodEnabled && selected && !isOrderable) && (
          <div className={classes.container}>
            <div className={classes.locationName}>{usedLocation?.name || ''}</div>
            <FulfillmentSelectorImpossibleError />
            <ChangeLocationButton onClick={handleChangeLocation} />
          </div>
        )}
        {/* eslint-disable-next-line no-constant-condition */}
        {false && !isRopeMethodEnabled ? (
          <div className={cx(classes.unavailable, classes.container)}>
            {i18n.text('locations.no_available')}
          </div>
        ) : null}

      </SurroundPortals>
      <FulfillmentSelectorAlternativeLocation
        show={!!isRopeMethodEnabled && (!!usedLocation && !!inventory && !isOrderable)}
        productId={productId}
      />
    </>
  );
}
