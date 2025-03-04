import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import { getProductRoute, FeaturedMedia, ProductBadges } from '@shopgate/engage/product';
import Link from '@shopgate/pwa-common/components/Link';
import ItemImage from './components/ItemImage';
import ItemDiscount from './components/ItemDiscount';
import ItemFavoritesButton from './components/ItemFavoritesButton';
import ItemDetails from './components/ItemDetails';
import styles, { itemDetails, itemImage, badgesPortal } from './style';

/**
 * The Product Grid Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ product, display }) => (
  <div className={`${styles} theme__product-grid__item`}>
    <Link
      tag="a"
      href={getProductRoute(product.id)}
      state={{ title: product.name }}
      className={itemImage}
      aria-hidden={!product.featuredMedia?.altText}
    >
      {isBeta() && product.featuredMedia
        ? <FeaturedMedia
          type={product.featuredMedia.type}
          url={product.featuredMedia.url}
          altText={product.featuredMedia.altText || product.name}
        />
        : <ItemImage
          productId={product.id}
          name={product.name}
          imageUrl={product.featuredImageBaseUrl}
        />
      }
    </Link>
    <ProductBadges location="productGrid" productId={product.id} className={badgesPortal}>
      <ItemDiscount
        productId={product.id}
        discount={product.price.discount || null}
      />
    </ProductBadges>
    <div className={itemDetails}>
      <ItemDetails
        product={product}
        display={display}
      />
      <ItemFavoritesButton productId={product.id} />
    </div>
  </div>
);

Item.propTypes = {
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

Item.defaultProps = {
  display: null,
};

export default memo(Item);
