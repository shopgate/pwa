import React from 'react';
import PropTypes from 'prop-types';
import Link from '@shopgate/pwa-common/components/Link';
import RatingStars from '@shopgate/pwa-ui-shared/RatingStars';
import ProductImage from 'Components/ProductImage';
import Badge from '../Badge';
import Price from '../Price';
import Title from '../Title';
import style from './style';

/**
 * @param {Object} props The component props.
 * @param {Object} props.product The product data.
 * @param {string} props.url The product route url.
 * @returns {JSX}
 */
function ProductCardRender({ product, url }) {
  const {
    featuredImageUrl,
    id,
    name,
    price,
    rating,
  } = product;

  return (
    <Link tagName="a" href={url}>
      <ProductImage itemProp="image" src={featuredImageUrl} alt={name} />
      {(price.discount > 0) && <Badge productId={id} value={-price.discount} />}
      <div className={style}>
        {(rating && rating.average > 0) && (
          <RatingStars value={product.rating.average} />
        )}
        <Title title={product.name} />
        <Price price={product.price} productId={id} />
      </div>
    </Link>
  );
}

ProductCardRender.propTypes = {
  product: PropTypes.shape().isRequired,
  url: PropTypes.string.isRequired,
};

export default ProductCardRender;
