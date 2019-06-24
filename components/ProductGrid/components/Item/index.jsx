import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { isBeta } from '@shopgate/engage/core';
import { getProductRoute, FeaturedMedia } from '@shopgate/engage/product';
import Link from '@shopgate/pwa-common/components/Link';
import ItemImage from './components/ItemImage';
import ItemDiscount from './components/ItemDiscount';
import ItemFavoritesButton from './components/ItemFavoritesButton';
import ItemDetails from './components/ItemDetails';
import styles from './style';

/**
 * The Product Grid Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ product, display }) => (
  <Link
    tagName="a"
    href={getProductRoute(product.id)}
    className={styles}
    state={{ title: product.name }}
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
        imageUrl={product.featuredImageUrl}
      />
    }

    <ItemDiscount
      productId={product.id}
      discount={product.price.discount || null}
    />
    <ItemFavoritesButton
      productId={product.id}
    />
    <ItemDetails
      productId={product.id}
      name={product.name}
      price={product.price}
      display={display}
    />
  </Link>
);

Item.propTypes = {
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

Item.defaultProps = {
  display: null,
};

export default pure(Item);
