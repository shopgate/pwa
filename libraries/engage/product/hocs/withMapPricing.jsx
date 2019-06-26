/* eslint-disable react/prop-types */
import React from 'react';
import TimeBoundary from '../../components/TimeBoundary';
import { useWidgetSettings } from '../../core';

/**
 * @param {Function|React.Component} PriceComponent price component with product price shape
 * @returns {Function}
 */
const withMapPricing = PriceComponent => (props) => {
  const settings = useWidgetSettings('@shopgate/engage/product/MapPrice');

  if (!settings.show) {
    return <PriceComponent {...props} />;
  }

  // price is null OR no map pricing
  if (!props.price || !props.price.mapPricing) {
    return <PriceComponent {...props} />;
  }

  // Same logic as in selector
  const mapPrice = [].concat(props.price.mapPricing)[0];

  // Show original when map is equal or less
  if (props.price.unitPrice >= mapPrice.price) {
    return <PriceComponent {...props} />;
  }

  return (
    <TimeBoundary
      start={new Date(mapPrice.startDate)}
      end={new Date(mapPrice.endDate)}
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
              unitPriceStriked: mapPrice.price,
            }}
          />
        );
      }}
    </TimeBoundary>
  );
};

export default withMapPricing;
/* eslint-enable react/prop-types */
