import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings, useCurrentProduct } from '../../../core';
import RelationsSliderContent from './RelationsSliderContent';
import { WIDGET_ID } from './constants';

/**
 * Renders the relations slider in the desired position on the Product Detail Page.
 * @param {string} desiredPosition The position the relations slider needs to render.
 * @returns {JSX}
 */
const RelationsSlider = ({ desiredPosition }) => {
  const { type, position } = useWidgetSettings(WIDGET_ID);
  const { productId } = useCurrentProduct();

  if (!type || position !== desiredPosition) {
    return null;
  }

  return <RelationsSliderContent productId={productId} type={type} />;
};

RelationsSlider.propTypes = {
  desiredPosition: PropTypes.oneOf(['header', 'description']),
};

RelationsSlider.defaultProps = {
  desiredPosition: 'header',
};

export default RelationsSlider;
