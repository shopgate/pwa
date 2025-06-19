import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core/helpers';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import {
  Link,
  RatingStars,
  DiscountBadge,
  SurroundPortals,
} from '@shopgate/engage/components';
import {
  getProductRoute,
} from '@shopgate/engage/product';
import {
  MapPriceHint,
  ProductImage,
  OrderQuantityHint,
  FeaturedMedia,
  Swatches,
  ProductName,
  ProductBadges,
} from '@shopgate/engage/product/components';
import { getProductImageSettings } from '@shopgate/engage/product/helpers';
import {
  PRODUCT_ITEM_DISCOUNT,
  PRODUCT_ITEM_PRICE,
} from '@shopgate/engage/category';
import ProductGridPrice from '../ProductGridPrice';
import styles from './style';

const location = 'productCard';

/**
 * The ProductCard component.
 * @param {Object} props The component props.
 * @param {Object} props.product The product data.
 * @param {boolean} props.hidePrice Whether the price should be hidden.
 * @param {boolean} props.hideRating Whether the rating should be hidden.
 * @param {boolean} props.hideName Whether the name should be hidden.
 * @param {number} props.titleRows The max number of rows for the product title.
 * @return {JSX.Element}
 */
function ProductCard(props) {
  const {
    product, hidePrice, hideRating, hideName, titleRows,
  } = props;

  const { ListImage: gridResolutions } = getProductImageSettings();
  const { showEmptyRatingStars = false } = useWidgetSettings('@shopgate/engage/rating');

  const showRatings = useMemo(() => {
    if (!hideRating && product?.rating?.average > 0) {
      return true;
    }

    if (!hideRating && showEmptyRatingStars && product?.rating) {
      return true;
    }

    return false;
  }, [hideRating, product, showEmptyRatingStars]);

  return (
    <Link
      className="engage__product-card"
      href={getProductRoute(product.id)}
      itemProp="item"
      itemScope
      itemType="http://schema.org/Product"
      tabIndex={0}
    >
      {isBeta() && product.featuredMedia
        ? <FeaturedMedia
          type={product.featuredMedia.type}
          url={product.featuredMedia.url}
          altText={product.featuredMedia.altText}
        />
        : <ProductImage
          src={product.featuredImageBaseUrl}
          resolutions={gridResolutions}
          alt={product.name}
          itemProp="image"
        />
      }
      <ProductBadges location={location} productId={product.id}>
        {!!(!hidePrice && product.price.discount) && (
        <div className={styles.badgeWrapper}>
          <SurroundPortals
            portalName={PRODUCT_ITEM_DISCOUNT}
            portalProps={{ productId: product.id }}
          >
            <DiscountBadge text={`-${product.price.discount}%`} />
          </SurroundPortals>
        </div>
        )}
      </ProductBadges>
      {!(hidePrice && hideRating) && (
        <div className={`${styles.details} engage__product-card__information`}>
            {showRatings && <RatingStars value={product.rating.average} />}
          {/*
            This feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects
          */}
          <Swatches productId={product.id} />

          {!hideName && (
            <ProductName
              name={product.name}
              className={styles.title}
              testId={`Productname: ${product.name}`}
              itemProp="name"
              rows={titleRows || 3}
            />
          )}

          {/*
            This feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects
          */}
          <MapPriceHint productId={product.id} />

          {/*
            This feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects
          */}
          <OrderQuantityHint productId={product.id} />

          {!hidePrice && (
            <SurroundPortals
              portalName={PRODUCT_ITEM_PRICE}
              portalProps={{
                productId: product.id,
                location,
              }}
            >
              <ProductGridPrice product={product} />
            </SurroundPortals>
          )}
        </div>
      )}
    </Link>
  );
}

ProductCard.propTypes = {
  hideName: PropTypes.bool.isRequired,
  hidePrice: PropTypes.bool.isRequired,
  hideRating: PropTypes.bool.isRequired,
  product: PropTypes.shape().isRequired,
  titleRows: PropTypes.number.isRequired,
};

export default ProductCard;
