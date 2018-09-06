import React from 'react';
import PropTypes from 'prop-types';
import ProductCharacteristics from '@shopgate/pwa-common/components/ProductCharacteristics';
import { ProductContext } from './../../context';
import Characteristic from './Characteristic';

/**
 * @param {Object} props The component props.
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
