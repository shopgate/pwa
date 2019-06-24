import React, { Fragment } from 'react';
import { isBeta } from '@shopgate/engage/core';
import { MediaSlider } from '@shopgate/engage/product';
import { ProductContext } from '../../context';
import ImageSlider from './components/ImageSlider';

/**
 * The product media component.
 * @returns {JSX}
 */
const Media = () => (
  <ProductContext.Consumer>
    {({ productId, variantId }) => (
      <Fragment>
        {/* MediaSlider feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects */}
        {isBeta()
          ? <MediaSlider productId={variantId || productId} />
          : <ImageSlider productId={productId} variantId={variantId} />
        }
      </Fragment>
    )}
  </ProductContext.Consumer>
);

export default Media;
