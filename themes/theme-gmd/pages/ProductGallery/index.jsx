import React from 'react';
import PropTypes from 'prop-types';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { RouteContext } from '@virtuous/react-conductor/Router';
import View from 'Components/View';
import ProductGalleryContent from './components/Content';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ProductGallery = ({ id, initialSlide }) => (
  <View hasNavigator={false} isFullscreen>
    {id && <ProductGalleryContent productId={id} initialSlide={initialSlide} />}
  </View>
);

ProductGallery.propTypes = {
  id: PropTypes.string,
  initialSlide: PropTypes.number,
};

ProductGallery.defaultProps = {
  id: null,
  initialSlide: 0,
};

export default () => (
  <RouteContext.Consumer>
    {({ params }) => (
      <ProductGallery
        id={hex2bin(params.productId) || null}
        initialSlide={parseInt(params.slide, 10) || 0}
      />
    )}
  </RouteContext.Consumer>
);

export { ProductGallery as UnwrappedProductGallery };
