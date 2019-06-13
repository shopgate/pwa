import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetConfig, useCurrentProduct } from '../../../core';

export const WIDGET_ID = '@shopgate/engage/product/RelationsSlider';

/**
 *
 */
const RelationsSlider = () => {
  const { type } = useWidgetConfig(WIDGET_ID);
  const { productId } = useCurrentProduct();

  if (!type) {
    return null;
  }
};

RelationsSlider.propTypes = {

};

export default RelationsSlider;
