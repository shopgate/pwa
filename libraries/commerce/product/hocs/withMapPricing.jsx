/* eslint-disable react/prop-types */
import React from 'react';
import TimeBoundary from '@shopgate/pwa-common/components/TimeBoundary';
import { LOCATION_CATEGORY, LOCATION_GRID, LOCATION_PRODUCT } from '../constants';
import {
  isVisiblePLP,
  isVisiblePDP,
  isVisibleSlider,
} from '../helpers/mapPrice';

const locationVisibility = {
  [LOCATION_CATEGORY]: isVisiblePLP,
  [LOCATION_PRODUCT]: isVisiblePDP,
  [LOCATION_GRID]: isVisibleSlider,
};

/**
 * @param {Function|React.Component} PriceComponent price component with product price shape
 * @param {string} location os price component
 * @returns {Function}
 */
const withMapPricing = (PriceComponent, location = LOCATION_CATEGORY) => (props) => {
  if (!locationVisibility[location]) {
    return <PriceComponent {...props} />;
  }

  // price is null || no map pricing
  if (!props.price || !props.price.mapPricing) {
    return <PriceComponent {...props} />;
  }

  // Show original when map is equal or less
  if (props.price.unitPrice >= props.price.mapPricing.price) {
    return <PriceComponent {...props} />;
  }

  return (
    <TimeBoundary
      start={new Date(props.price.mapPricing.startDate)}
      end={new Date(props.price.mapPricing.endDate)}
    >
      {({ between }) => {
        if (!between) {
          return <PriceComponent {...props} />;
        }
        return (
          <PriceComponent
            {...props}
            price={{
              ...props.price,
              unitPriceStriked: props.price.mapPricing.price,
            }}
          />
        );
      }}
    </TimeBoundary>
  );
};

export default withMapPricing;
/* eslint-enable react/prop-types */
