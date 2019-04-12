/* eslint-disable react/prop-types */
import React from 'react';
import withMapPricing from './withMapPricing';
import { LOCATION_CATEGORY } from '../constants';

/**
 * @param {Function|React.Component} PriceComponent price component with product price shape
 * @param {string} location of price component
 * @returns {Function}
 */
const withPriceCalculation = (PriceComponent, location = LOCATION_CATEGORY) => (props) => {
  // price is null
  if (!props.price) {
    return <PriceComponent {...props} />;
  }

  // HOC for map price
  if (props.price.mapPricing) {
    return withMapPricing(PriceComponent, location)(props);
  }
  // Fallback to default
  return <PriceComponent {...props} />;
};

export default withPriceCalculation;
/* eslint-enable react/prop-types */
