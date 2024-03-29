import React from 'react';
import PropTypes from 'prop-types';
import { isBeta, useWidgetSettings } from '@shopgate/engage/core';
import {
  FeaturedMedia,
  getProductImageSettings,
  MapPriceHint,
  OrderQuantityHint,
  ProductImage,
  ProductBadges,
} from '@shopgate/engage/product';
import Link from '@shopgate/pwa-common/components/Link';
import RatingStars from '@shopgate/pwa-ui-shared/RatingStars';
import Badge from '../Badge';
import Price from '../Price';
import Title from '../Title';
import style from './style';

/**
 * @param {Object} props The component props.
 * @param {Object} props.product The product data.
 * @param {string} props.url The product route url.
 * @param {boolean} props.hidePrice Whether the price should be hidden.
 * @param {boolean} props.hideRating Whether the rating should be hidden.
 * @param {boolean} props.hideName Whether the name should be hidden.
 * @param {number} props.titleRows The max number of rows for the product title.
 * @returns {JSX}
 */
function ProductCardRender({
  product,
  url,
  hideName,
  hidePrice,
  hideRating,
  titleRows,
}) {
  const {
    featuredImageBaseUrl,
    featuredMedia,
    id,
    name,
    price,
    rating,
  } = product;

  const { ListImage: gridResolutions } = getProductImageSettings();
  const { showEmptyRatingStars = false } = useWidgetSettings('@shopgate/engage/rating');
  let showRatings = false;
  if (!hideRating && rating && rating.average > 0) {
    showRatings = true;
  } else if (!hideRating && showEmptyRatingStars && product.rating) {
    showRatings = true;
  }
  return (
    <Link tagName="a" href={url}>

      {isBeta() && featuredMedia
        ? <FeaturedMedia
          type={featuredMedia.type}
          url={featuredMedia.url}
          altText={featuredMedia.altText}
        />
        : <ProductImage
          itemProp="image"
          src={featuredImageBaseUrl}
          resolutions={gridResolutions}
          alt={name}
        />
      }
      <ProductBadges location="productCard" productId={product.id}>
        {(!hidePrice && price.discount > 0) && <Badge productId={id} value={-price.discount} />}
      </ProductBadges>

      {(!(hidePrice && hideRating)) && (
        <div className={style}>
          { showRatings && <RatingStars value={product.rating.average} />}
          {!hideName && (
            <Title title={product.name} rows={titleRows} />
          )}

          {/* This feature is currently in BETA testing.
          It should only be used for approved BETA Client Projects */}
          <MapPriceHint productId={product.id} />

          {/* This feature is currently in BETA testing.
          It should only be used for approved BETA Client Projects */}
          <OrderQuantityHint productId={product.id} />

          {!hidePrice && (
            <Price price={product.price} productId={id} />
          )}
        </div>
      )}
    </Link>
  );
}

ProductCardRender.Badge = Badge;
ProductCardRender.Price = Price;
ProductCardRender.Title = Title;

ProductCardRender.propTypes = {
  product: PropTypes.shape().isRequired,
  url: PropTypes.string.isRequired,
  hideName: PropTypes.bool,
  hidePrice: PropTypes.bool,
  hideRating: PropTypes.bool,
  titleRows: PropTypes.number,
};

ProductCardRender.defaultProps = {
  hideName: false,
  hidePrice: false,
  hideRating: false,
  titleRows: 3,
};

export default ProductCardRender;
