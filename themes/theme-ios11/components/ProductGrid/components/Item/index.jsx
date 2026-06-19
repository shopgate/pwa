import React, { memo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import { getProductRoute, FeaturedMedia, ProductBadges } from '@shopgate/engage/product';
import { Link } from '@shopgate/engage/components';
import { useProductListType } from '@shopgate/engage/product/hooks';
import { capture } from '../../../HeroTransition/flight';
import ItemImage from './components/ItemImage';
import ItemDiscount from './components/ItemDiscount';
import ItemFavoritesButton from './components/ItemFavoritesButton';
import ItemDetails from './components/ItemDetails';
import styles, { itemDetails } from './style';

// Layout-neutral wrapper around the product image; carries the hero-transition
// click capture without altering the card layout (full-width block, no height).
const imageWrapperStyle = { display: 'block', width: '100%' };

/**
 * The Product Grid Item component.
 * @param {Object} props The component props.
 * @param {Object} props.product The product.
 * @param {Object} props.display The display object.
 * @return {JSX.Element}
 */
const Item = ({ product, display }) => {
  const { meta } = useProductListType();
  const imageWrapperRef = useRef(null);

  /**
   * Captures the clicked product image as the hero transition source.
   * Must not interfere with the Link navigation; skips silently when no
   * image or src can be resolved.
   * @returns {void}
   */
  const handleCaptureSource = useCallback(() => {
    const wrapper = imageWrapperRef.current;

    if (!wrapper) {
      return;
    }

    const image = wrapper.querySelector('.common__image, img') || wrapper;
    const rect = image.getBoundingClientRect();
    const src = image.currentSrc || image.src || product.featuredImageBaseUrl || null;

    if (!src) {
      return;
    }

    capture({
      sourceRect: rect,
      src,
      productId: product.id,
    });
  }, [product.id, product.featuredImageBaseUrl]);

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
        <div
          ref={imageWrapperRef}
          onClick={handleCaptureSource}
          role="presentation"
          style={imageWrapperStyle}
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
            />}
        </div>
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
