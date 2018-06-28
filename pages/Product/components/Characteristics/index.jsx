import React from 'react';
import PropTypes from 'prop-types';
import ProductCharacteristics from './ProductCharacteristics';
import Characteristic from './Characteristic';

/**
 * @return {JSX}
 */
const Characteristics = ({ productId }) => (
  <ProductCharacteristics
    productId={productId}
    render={props => <Characteristic {...props} />}
  />
);

Characteristics.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default Characteristics;
