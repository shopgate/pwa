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
const Product = ({ id }) => (
  <View>
    {id && <ProductContent id={id} />}
  </View>
);

Product.propTypes = {
  id: PropTypes.string,
};

Product.defaultProps = {
  id: null,
};

export default () => (
  <RouteContext.Consumer>
    {({ params }) => (
      <Product id={hex2bin(params.productId) || null} />
    )}
  </RouteContext.Consumer>
);
