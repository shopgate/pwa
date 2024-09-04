import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core/helpers';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import {
  getProductImageSettings,
} from '@shopgate/engage/product/helpers';
import { useProductListType } from '@shopgate/engage/product/hooks';
import {
  MapPriceHint,
  OrderQuantityHint,
  ProductImage,
  ProductBadges,
  FeaturedMedia,
} from '@shopgate/engage/product/components';
import { Link, RatingStars } from '@shopgate/engage/components';
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
  const { meta } = useProductListType();

  const { showEmptyRatingStars = false } = useWidgetSettings('@shopgate/engage/rating');

  const showRatings = useMemo(() => {
    if (!hideRating && rating?.average > 0) {
      return true;
    }

    if (!hideRating && showEmptyRatingStars && rating) {
      return true;
    }

    return false;
  }, [hideRating, rating, showEmptyRatingStars]);
  return (
    <Link
      tagName="a"
      href={url}
      state={{
        ...meta,
      }}
    >

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
          {showRatings && <RatingStars value={product.rating.average} />}
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
            <Price product={product} />
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
