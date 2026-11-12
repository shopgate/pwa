import React from 'react';
import PropTypes from 'prop-types';
import { MediaSlider, MediaImage } from '@shopgate/engage/product';
import { useProductGallerySettings } from '@shopgate/engage/product/hooks';
import connect from './connector';

/**
 * The product media slider component.
 * @returns {JSX.Element}
 */
const ProductMediaSlider = ({
  productId,
  featuredMediaBaseProduct,
  featuredMediaCharacteristics,
  className,
}) => {
  const { pagination } = useProductGallerySettings();

  return (
    <MediaSlider
      key={pagination}
      paginationType={pagination}
      productId={productId}
      className={className}
      renderPlaceholder={(featuredMedia) => {
        const props = featuredMediaCharacteristics || featuredMedia || featuredMediaBaseProduct;
        return (<MediaImage {...props} className={className} />);
      }}
      {...pagination === 'bulletsBelow' ? {
        swiperProps: {
          style: {
            marginBottom: -8,
          },
        },
      } : {}}
    />
  );
};

ProductMediaSlider.propTypes = {
  className: PropTypes.string,
  featuredMediaBaseProduct: PropTypes.shape({
    type: PropTypes.string,
    code: PropTypes.string,
    altText: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
  }),
  featuredMediaCharacteristics: PropTypes.shape({
    type: PropTypes.string,
    code: PropTypes.string,
    altText: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
  }),
  productId: PropTypes.string,
  variantId: PropTypes.string,
};

ProductMediaSlider.defaultProps = {
  className: null,
  featuredMediaCharacteristics: null,
  featuredMediaBaseProduct: null,
  productId: null,
  variantId: null,
};

export default connect(ProductMediaSlider);
