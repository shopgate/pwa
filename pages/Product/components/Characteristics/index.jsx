import React from 'react';
import PropTypes from 'prop-types';
import ProductContext from '../../context';
import ProductCharacteristics from './ProductCharacteristics';
import Characteristic from './Characteristic';

/**
 * @return {JSX}
 */
const Characteristics = ({ productId, variantId }) => (
  <ProductContext.Consumer>
    {({ conditioner }) => (
      <ProductCharacteristics
        productId={productId}
        variantId={variantId}
        render={props => <Characteristic {...props} />}
        conditioner={conditioner}
      />
    )}
  </ProductContext.Consumer>
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
