/* eslint-disable react/prop-types */
import React from 'react';
import TimeBoundary from '@shopgate/pwa-common/components/TimeBoundary';
import {
  isVisiblePLP,
  isVisiblePDP,
  isVisibleSlider,
} from '@shopgate/pwa-common-commerce/product/helpers/mapPrice';

const locationVisibility = {
  plp: isVisiblePLP,
  pdp: isVisiblePDP,
  slider: isVisibleSlider,
};

/**
 * @param {Function} PriceComponent price component with product price shape
 * @param {string} location os price component
 * @return {Object}
 */
const withMapPricing = (PriceComponent, location = 'plp') => (props) => {
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
