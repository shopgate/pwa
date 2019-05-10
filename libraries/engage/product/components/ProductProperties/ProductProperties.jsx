import React from 'react';
import { isBeta, useCurrentProduct } from '../../../core';
import { ProductPropertiesDefault } from './ProductPropertiesDefault';

/**
 * The product properties.
 * @returns {JSX}
 */
export function ProductProperties() {
  const productProps = useCurrentProduct();

  if (!isBeta()) {
    return <ProductPropertiesDefault {...productProps} />;
  }

  return (
    <div>New Properties</div>
  );
}
