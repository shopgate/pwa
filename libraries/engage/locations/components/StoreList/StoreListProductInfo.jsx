// @flow
import React, { useContext } from 'react';
import { Grid, ProductProperties } from '@shopgate/engage/components';
import { ProductGridPrice } from '../../../product';
import { FulfillmentContext } from '../../locations.context';
import { productInfo, productInfoLeft, priceInfo } from './StoreListProduct.style';

/**
 * Renders the product information of the store list.
 * @returns {JSX}
 */
function StoreListProductInfo() {
  const { product } = useContext(FulfillmentContext);
  if (!product) {
    return null;
  }

  const { characteristics, price } = product;

  return (
    <Grid className={productInfo}>
      <Grid.Item grow={1} className={productInfoLeft}>
        {characteristics && <ProductProperties properties={characteristics} />}
      </Grid.Item>
      <Grid.Item shrink={0} className={priceInfo}>
        <ProductGridPrice price={price} />
      </Grid.Item>
    </Grid>
  );
}

export default StoreListProductInfo;
