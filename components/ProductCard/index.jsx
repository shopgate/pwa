import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import Grid from '@shopgate/pwa-common/components/Grid';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants/index';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import ProductImage from 'Components/ProductImage';
import RatingStars from '@shopgate/pwa-ui-shared/RatingStars';
import PriceInfo from '@shopgate/pwa-ui-shared/PriceInfo';
import Price from '@shopgate/pwa-ui-shared/Price';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
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
    {/* <FavoritesButton className={styles.wishlist} productId={product.id} /> */}
    {(!(hidePrice && hideRating)) && (
      <div className={styles.details}>
        {!hideRating && product.rating && product.rating.average > 0 && (
          <RatingStars value={product.rating.average} />
        )}
        {!hideName && (
          <div itemProp="name" className={styles.title}>
            <Ellipsis rows={titleRows || 3}>{product.name}</Ellipsis>
          </div>
        )}
        {!hidePrice && (
          <Grid className={styles.priceWrapper} wrap>
            <Grid.Item grow={1}>
              <Price
                unitPrice={product.price.unitPrice}
                unitPriceMin={product.price.unitPriceMin}
                discounted={!!product.price.discount}
                currency={product.price.currency}
              />
            </Grid.Item>
            {product.price.unitPriceStriked > 0 && (
              <Grid.Item>
                <PriceStriked
                  value={product.price.unitPriceStriked}
                  currency={product.price.currency}
                />
              </Grid.Item>
            )}
          </Grid>
        )}
        {(!hidePrice && product.price.info) && (
          <Grid>
            <Grid.Item>
              <PriceInfo className={styles.basicPrice} text={product.price.info} />
            </Grid.Item>
          </Grid>
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
