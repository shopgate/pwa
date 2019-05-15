/* eslint-disable react/prop-types */
import React from 'react';
import { isBeta } from '../../core';
import withMapPricing from './withMapPricing';

/**
 * @param {Function|React.Component} PriceComponent price component with product price shape
 * @returns {Function}
 */
const withPriceCalculation = PriceComponent => (props) => {
  // price is null
  if (!props.price) {
    return <PriceComponent {...props} />;
  }

  // HOC for map price
  if (isBeta() && props.price.mapPricing) {
    return withMapPricing(PriceComponent)(props);
  }
  // Fallback to default
  return <PriceComponent {...props} />;
};

export default withPriceCalculation;
/* eslint-enable react/prop-types */
