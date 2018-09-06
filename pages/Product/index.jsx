import React from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { RouteContext } from '@virtuous/react-conductor/Router';
import ProductContent from './components/Content';

/**
 * The product detail page (PDP).
 * @return {JSX}
 */
const Product = ({ id, isVariant }) => (
  <View>
    {id && <ProductContent productId={id} isVariant={isVariant} />}
  </View>
);

Product.propTypes = {
  id: PropTypes.string,
  isVariant: PropTypes.bool,
};

Product.defaultProps = {
  id: null,
  isVariant: false,
};

export default () => (
  <RouteContext.Consumer>
    {({ params, state }) => (
      <Product id={hex2bin(params.productId) || null} isVariant={state.isVariant || false} />
    )}
  </RouteContext.Consumer>
);

export { Product as UnwrappedProduct };
