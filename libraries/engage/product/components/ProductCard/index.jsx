import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, Ellipsis, Portal, RatingStars, DiscountBadge } from '@shopgate/engage/components';
import { getProductRoute, MapPriceHint, ProductImage, OrderQuantityHint } from '@shopgate/engage/product';
import * as portals from '@shopgate/pwa-common-commerce/category';
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
 * @return {JSX}
 */
function ProductCard(props) {
  const {
    product, hidePrice, hideRating, hideName, titleRows,
  } = props;

  return (
    <Link
      tagName="a"
      href={getProductRoute(product.id)}
      itemProp="item"
      itemScope
      itemType="http://schema.org/Product"
    >
      <ProductImage itemProp="image" src={product.featuredImageUrl} alt={product.name} />
      {!!(!hidePrice && product.price.discount) && (
        <div className={styles.badgeWrapper}>
          <Portal name={portals.PRODUCT_ITEM_DISCOUNT_BEFORE} props={{ productId: product.id }} />
          <Portal name={portals.PRODUCT_ITEM_DISCOUNT} props={{ productId: product.id }}>
            <DiscountBadge text={`-${product.price.discount}%`} />
          </Portal>
          <Portal name={portals.PRODUCT_ITEM_DISCOUNT_AFTER} props={{ productId: product.id }} />
        </div>
      )}
      {!(hidePrice && hideRating) && (
        <div className={styles.details}>
          {!hideRating && product.rating && product.rating.average > 0 && (
            <RatingStars value={product.rating.average} />
          )}
          {!hideName && (
            <div
              itemProp="name"
              className={styles.title}
              data-test-id={`Productname: ${product.name}`}
            >
              <Ellipsis rows={titleRows || 3}>{product.name}</Ellipsis>
            </div>
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
            <Fragment>
              <Portal
                name={portals.PRODUCT_ITEM_PRICE_BEFORE}
                props={{
                  productId: product.id,
                  location,
                }}
              />
              <Portal
                name={portals.PRODUCT_ITEM_PRICE}
                props={{
                  productId: product.id,
                  location,
                }}
              >
                <ProductGridPrice price={product.price} />
              </Portal>
              <Portal
                name={portals.PRODUCT_ITEM_PRICE_AFTER}
                props={{
                  productId: product.id,
                  location,
                }}
              />
            </Fragment>
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
