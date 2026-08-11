import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core/helpers';
import { useProductListType, useShowEmptyRatingStars } from '@shopgate/engage/product/hooks';
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
import {
  PRODUCT_ITEM_DISCOUNT,
  PRODUCT_ITEM_PRICE,
} from '@shopgate/engage/category';
import { useSelector } from 'react-redux';
import { makeStyles, SHADOW_COLOR_VAR } from '@shopgate/engage/styles';
import { getProductCardNameMaxLines, getCardShadowSize } from '@shopgate/engage/settings/selectors/appSettings';
import ProductGridPrice from '../ProductGridPrice';

const useStyles = makeStyles()((theme, { size }) => ({
  root: {
    display: 'block',
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    background: theme.components.cards.backgroundColor,
    borderRadius: theme.shape.cardsBorderRadius,
    [SHADOW_COLOR_VAR]: theme.components.cards.shadowColor,
    boxShadow: theme.shadowSizes[size],
    border: theme.components.cards.border,
  },
  details: {
    padding: '12px 16px',
  },
  title: {
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.15,
    marginTop: 1,
  },
  badgeWrapper: {
    minWidth: 40,
  },
}));

const location = 'productCard';

/**
 * The ProductCard component.
 * @param {Object} props The component props.
 * @param {Object} props.product The product data.
 * @param {boolean} props.hidePrice Whether the price should be hidden.
 * @param {boolean} props.hideRating Whether the rating should be hidden.
 * @param {boolean} props.hideName Whether the name should be hidden.
 * @param {number} props.titleRows Optional override for the max number of rows for the product
 * title
 * @param {string} props.url Optional alternative url for the product link
 * @return {JSX.Element}
 */
function ProductCard(props) {
  const shadowSize = useSelector(getCardShadowSize);
  const { classes, cx } = useStyles({ size: shadowSize });
  const {
    product, hidePrice, hideRating, hideName, titleRows, url,
  } = props;
  const { meta } = useProductListType();
  const productNameLines = useSelector(getProductCardNameMaxLines);

  const showEmptyRatingStars = useShowEmptyRatingStars();

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
      className={cx(classes.root, 'engage__product-card')}
      href={url || getProductRoute(product.id)}
      itemProp="item"
      itemScope
      itemType="http://schema.org/Product"
      tabIndex={0}
      state={{
        ...meta,
      }}
    >
      <div>
        {isBeta() && product.featuredMedia
          ? <FeaturedMedia
              type={product.featuredMedia.type}
              url={product.featuredMedia.url}
              altText={product.featuredMedia.altText}
          />
          : <ProductImage
              src={product.featuredImageBaseUrl}
              context="list"
              alt={product.name}
              itemProp="image"
          />}
      </div>
      <ProductBadges location={location} productId={product.id}>
        {!!(!hidePrice && product.price.discount) && (
        <div className={classes.badgeWrapper}>
          <SurroundPortals
            portalName={PRODUCT_ITEM_DISCOUNT}
            portalProps={{ productId: product.id }}
          >
            <DiscountBadge text={`-${product.price.discount}%`} />
          </SurroundPortals>
        </div>
        )}
      </ProductBadges>
      {!(hidePrice && hideRating && hideName) && (
        <div className={cx(classes.details, 'engage__product-card__information')}>
            {showRatings && <RatingStars value={product.rating.average} />}
          {/*
            This feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects
          */}
          <Swatches productId={product.id} />
          {!hideName && (
            <ProductName
              name={product.name}
              className={classes.title}
              testId={`Productname: ${product.name}`}
              itemProp="name"
              rows={titleRows || productNameLines}
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

/**
 * After a refactoring of the Theme API ProductCard component, this component replaced a
 * sub-component of the ProductCard.
 * The original implementation exposed a couple of sub-components that don't exist in the new
 * implementation. Since we expect that they are not used anywhere, we replace them with mocks.
 *
 * Link to a GitHub tag that contains the original implementation:
 * @link https://github.com/shopgate/pwa/blob/v7.27.1/themes/theme-ios11/themeApi/ProductCard/components/Render/index.jsx#L115
 */

ProductCard.Badge = () => null;
ProductCard.Price = () => null;
ProductCard.Title = () => null;

ProductCard.propTypes = {
  product: PropTypes.shape().isRequired,
  hideName: PropTypes.bool,
  hidePrice: PropTypes.bool,
  hideRating: PropTypes.bool,
  titleRows: PropTypes.number,
  url: PropTypes.string,
};

ProductCard.defaultProps = {
  hideName: false,
  hidePrice: false,
  hideRating: false,
  titleRows: null,
  url: null,
};

export default ProductCard;
