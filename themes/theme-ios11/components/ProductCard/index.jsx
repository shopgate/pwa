import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants/index';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import RatingStars from '@shopgate/pwa-ui-shared/RatingStars';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import ProductImage from 'Components/ProductImage';
import ProductGridPrice from 'Components/ProductGridPrice';
import styles from './style';

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
const ProductCard = ({
  product, hidePrice, hideRating, hideName, titleRows,
}) => (
  <Link
    tagName="a"
    href={`${ITEM_PATH}/${bin2hex(product.id)}`}
    className={styles.container}
    itemProp="item"
    itemScope
    itemType="http://schema.org/Product"
  >
    <ProductImage
      itemProp="image"
      src={product.featuredImageUrl}
      alt={product.name}
    />
    {!!(!hidePrice && product.price && product.price.discount) && (
      <div className={styles.badgeWrapper}>
        <Portal name={portals.PRODUCT_ITEM_DISCOUNT_BEFORE} props={{ productId: product.id }} />
        <Portal name={portals.PRODUCT_ITEM_DISCOUNT} props={{ productId: product.id }}>
          <DiscountBadge text={`-${product.price.discount}%`} />
        </Portal>
        <Portal name={portals.PRODUCT_ITEM_DISCOUNT_AFTER} props={{ productId: product.id }} />
      </div>
    )}
    {/* <FavoritesButton className={styles.wishlist} productId={product.id} /> */}
    {(!(hidePrice && hideRating)) && (
      <div className={styles.details}>
        {!hideRating && product.rating && product.rating.average > 0 && (
          <RatingStars value={product.rating.average} />
        )}
        {!hideName && (
          <div itemProp="name" className={styles.title} data-test-id={`Productname: ${product.name}`}>
            <Ellipsis rows={titleRows || 3}>{product.name}</Ellipsis>
          </div>
        )}
        {!hidePrice && (
          <Fragment>
            <Portal name={portals.PRODUCT_ITEM_PRICE_BEFORE} props={{ productId: product.id }} />
            <Portal name={portals.PRODUCT_ITEM_PRICE} props={{ productId: product.id }}>
              <ProductGridPrice price={product.price} />
              <Portal name={portals.PRODUCT_ITEM_PRICE_AFTER} props={{ productId: product.id }} />
            </Portal>
          </Fragment>
        )}
      </div>
    )}
  </Link>
);

ProductCard.propTypes = {
  hideName: PropTypes.bool.isRequired,
  hidePrice: PropTypes.bool.isRequired,
  hideRating: PropTypes.bool.isRequired,
  product: PropTypes.shape().isRequired,
  titleRows: PropTypes.number.isRequired,
};

export default ProductCard;
