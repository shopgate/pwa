import React from 'react';
import PropTypes from 'prop-types';
import ProductCharacteristics from './ProductCharacteristics';
import Characteristic from './Characteristic';

/**
 * @return {JSX}
 */
const Characteristics = ({ productId, variantId }) => (
  <ProductCharacteristics
    productId={productId}
    variantId={variantId}
    render={props => <Characteristic {...props} />}
  />
);

Characteristics.propTypes = {
  productId: PropTypes.string,
  variantId: PropTypes.string,
};

Characteristics.defaultProps = {
  productId: null,
  variantId: null,
};

export default Characteristics;
