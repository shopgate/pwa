import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import { getProductRoute, FeaturedMedia, ProductBadges } from '@shopgate/engage/product';
import { Link } from '@shopgate/engage/components';
import { useProductListType } from '@shopgate/engage/product/hooks';
import ItemImage from './components/ItemImage';
import ItemDiscount from './components/ItemDiscount';
import ItemFavoritesButton from './components/ItemFavoritesButton';
import ItemDetails from './components/ItemDetails';
import styles, { itemDetails } from './style';

/**
 * The Product Grid Item component.
 * @param {Object} props The component props.
 * @param {Object} props.product The product.
 * @param {Object} props.display The display object.
 * @return {JSX.Element}
 */
const Item = ({ product, display }) => {
  const { meta } = useProductListType();

  return (
    <div className={`${styles} theme__product-grid__item`}>
      <Link
        role="none"
        href={getProductRoute(product.id)}
        state={{
          title: product.name,
          ...meta,
        }}
      >
        {isBeta() && product.featuredMedia
          ? <FeaturedMedia
            type={product.featuredMedia.type}
            url={product.featuredMedia.url}
          />
          : <ItemImage
            productId={product.id}
            name={product.name}
            imageUrl={product.featuredImageBaseUrl}
          />
    }
      </Link>
      <ProductBadges location="productGrid" productId={product.id}>
        <ItemDiscount
          productId={product.id}
          discount={product.price.discount || null}
        />
      </ProductBadges>
      <div className={itemDetails}>
        <ItemDetails
          product={product}
          display={display}
          productListTypeMeta={meta}
        />
        <ItemFavoritesButton productId={product.id} />
      </div>
    </div>
  );
};

Item.propTypes = {
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

Item.defaultProps = {
  display: null,
};

export default memo(Item);
