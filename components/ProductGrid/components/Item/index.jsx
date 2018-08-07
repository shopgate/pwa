import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import Link from '@shopgate/pwa-common/components/Link';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants/index';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
import ProductImage from 'Components/ProductImage';
import ProductGridPrice from 'Components/ProductGridPrice';
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
    state={{ title: product.name }}
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
      <div className={styles.favorites} data-test-id="favorites">
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
              <div className={styles.title} itemProp="name" data-test-id={`Productname: ${product.name}`}>
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
              <ProductGridPrice price={product.price} />
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

export default connect(pure(Item));
