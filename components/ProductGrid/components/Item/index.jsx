import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import { getProductRoute, FeaturedMedia } from '@shopgate/engage/product';
import { Link } from '@shopgate/engage/components';
import ItemImage from './components/ItemImage';
import ItemDiscount from './components/ItemDiscount';
import ItemFavoritesButton from './components/ItemFavoritesButton';
import ItemDetails from './components/ItemDetails';
import styles, { itemDetails } from './style';

/**
 * The Product Grid Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ product, display }) => (
  <div className={styles}>
    <Link
      tagName="a"
      href={getProductRoute(product.id)}
      state={{ title: product.name }}
      aria-hidden
    >
      {isBeta() && product.featuredMedia
        ? <FeaturedMedia
          type={product.featuredMedia.type}
          url={product.featuredMedia.url}
          altText={product.featuredMedia.altText}
        />
        : <ItemImage
          productId={product.id}
          name={product.name}
          imageUrl={product.featuredImageBaseUrl}
        />
    }
    </Link>

    <ItemDiscount
      productId={product.id}
      discount={product.price.discount || null}
    />

    <div className={itemDetails}>
      <Link
        tagName="a"
        href={getProductRoute(product.id)}
        state={{ title: product.name }}
      >
        <ItemDetails
          product={product}
          display={display}
        />
      </Link>
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
