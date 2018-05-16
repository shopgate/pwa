import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants/index';
import ProductImage from 'Components/ProductImage';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import PriceInfo from '@shopgate/pwa-ui-shared/PriceInfo';
import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
import styles from './style';
import connect from './connector';

/**
 * The Product Grid Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ product, display, isFavorite }) => (
  <Link
    tagName="a"
    href={`${ITEM_PATH}/${bin2hex(product.id)}`}
    className={styles.container}
    itemProp="item"
    itemScope
    itemType="http://schema.org/Product"
  >

    {/* IMAGE */}
    <Portal name={portals.PRODUCT_ITEM_IMAGE_BEFORE} props={{ productId: product.id }} />
    <Portal name={portals.PRODUCT_ITEM_IMAGE} props={{ productId: product.id }}>
      <ProductImage alt={product.name} itemProp="image" src={product.featuredImageUrl} />
    </Portal>
    <Portal name={portals.PRODUCT_ITEM_IMAGE_AFTER} props={{ productId: product.id }} />

    {/* DISCOUNT */}
    {!!product.price.discount && (
      <div className={styles.badgeWrapper}>
        <Portal name={portals.PRODUCT_ITEM_DISCOUNT_BEFORE} props={{ productId: product.id }} />
        <Portal name={portals.PRODUCT_ITEM_DISCOUNT} props={{ productId: product.id }}>
          <DiscountBadge text={`-${product.price.discount}%`} />
        </Portal>
        <Portal name={portals.PRODUCT_ITEM_DISCOUNT_AFTER} props={{ productId: product.id }} />
      </div>
    )}

    {/* FAVORITES BUTTONS */}
    <Portal name={portals.PRODUCT_ITEM_FAVORITES_BUTTON_BEFORE} props={{ productId: product.id }} />
    <Portal name={portals.PRODUCT_ITEM_FAVORITES_BUTTON} props={{ productId: product.id }}>
      <div className={styles.favorites}>
        <FavoritesButton active={isFavorite} productId={product.id} noShadow removeWithRelatives />
      </div>
    </Portal>
    <Portal name={portals.PRODUCT_ITEM_FAVORITES_BUTTON_AFTER} props={{ productId: product.id }} />

    {(!display || display.name || display.price || display.reviews) && (
      <div className={styles.details}>

        {/* NAME */}
        {(!display || display.name) && (
          <Fragment>
            <Portal name={portals.PRODUCT_ITEM_NAME_BEFORE} props={{ productId: product.id }} />
            <Portal name={portals.PRODUCT_ITEM_NAME} props={{ productId: product.id }}>
              <div className={styles.title} itemProp="name">
                <Ellipsis>{product.name}</Ellipsis>
              </div>
            </Portal>
            <Portal name={portals.PRODUCT_ITEM_NAME_AFTER} props={{ productId: product.id }} />
          </Fragment>
        )}

        {/* PRICE - STRIKE PRICE - PRICE INFO */}
        {(!display || display.price) && (
          <Fragment>
            <Portal name={portals.PRODUCT_ITEM_PRICE_BEFORE} props={{ productId: product.id }} />
            <Portal name={portals.PRODUCT_ITEM_PRICE} props={{ productId: product.id }}>
              <Grid className={styles.priceWrapper} wrap>
                <Grid.Item grow={1}>
                  <Price
                    unitPrice={product.price.unitPrice}
                    unitPriceMin={product.price.unitPriceMin}
                    discounted={!!product.price.discount}
                    currency={product.price.currency}
                  />
                </Grid.Item>
                {(product.price.msrp > 0 && product.price.unitPrice !== product.price.msrp) && (
                  <Grid.Item>
                    <PriceStriked
                      value={product.price.msrp}
                      currency={product.price.currency}
                    />
                  </Grid.Item>
                )}
                {(!product.price.msrp && product.price.unitPriceStriked > 0) && (
                  <Grid.Item>
                    <PriceStriked
                      value={product.price.unitPriceStriked}
                      currency={product.price.currency}
                    />
                  </Grid.Item>
                )}
              </Grid>
              <Grid>
                {product.price.info && (
                  <Grid.Item>
                    <PriceInfo className={styles.basicPrice} text={product.price.info} />
                  </Grid.Item>
                )}
              </Grid>
            </Portal>
            <Portal name={portals.PRODUCT_ITEM_PRICE_AFTER} props={{ productId: product.id }} />
          </Fragment>
        )}
      </div>
    )}
  </Link>
);

Item.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

Item.defaultProps = {
  display: null,
};

export default connect(Item);
