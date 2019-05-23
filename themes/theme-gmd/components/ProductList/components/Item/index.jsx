import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Image,
  Link,
  Ellipsis,
  Portal,
  DiscountBadge,
  Price,
  PriceStriked,
  PriceInfo,
  Manufacturer,
  Availability,
} from '@shopgate/engage/components';
import { bin2hex } from '@shopgate/engage/core';
import {
  PRODUCT_ITEM_IMAGE_BEFORE,
  PRODUCT_ITEM_IMAGE,
  PRODUCT_ITEM_IMAGE_AFTER,
  PRODUCT_ITEM_DISCOUNT_BEFORE,
  PRODUCT_ITEM_DISCOUNT,
  PRODUCT_ITEM_DISCOUNT_AFTER,
  PRODUCT_ITEM_NAME_BEFORE,
  PRODUCT_ITEM_NAME,
  PRODUCT_ITEM_NAME_AFTER,
  PRODUCT_ITEM_MANUFACTURER_BEFORE,
  PRODUCT_ITEM_MANUFACTURER,
  PRODUCT_ITEM_MANUFACTURER_AFTER,
  PRODUCT_ITEM_AVAILABILITY_BEFORE,
  PRODUCT_ITEM_AVAILABILITY,
  PRODUCT_ITEM_AVAILABILITY_AFTER,
  PRODUCT_ITEM_PRICE_BEFORE,
  PRODUCT_ITEM_PRICE,
  PRODUCT_ITEM_PRICE_AFTER,
  PRODUCT_ITEM_PRICE_INSIDE_BEFORE,
  PRODUCT_ITEM_PRICE_INSIDE_AFTER,
} from '@shopgate/engage/category';
import { ITEM_PATH } from '@shopgate/engage/product';

import styles from './style';

/**
 * The Product List Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ display, product }) => (
  <Link
    tagName="a"
    href={`${ITEM_PATH}/${bin2hex(product.id)}`}
    className={styles.container}
    itemProp="item"
    itemScope
    itemType="http://schema.org/Product"
  >
    <Grid className={styles.listItemContainer}>
      <Grid.Item shrink={0} className={styles.imageContainer}>

        {/* IMAGE */}
        <Portal name={PRODUCT_ITEM_IMAGE_BEFORE} props={{ productId: product.id }} />
        <Portal name={PRODUCT_ITEM_IMAGE} props={{ productId: product.id }}>
          <Image itemProp="image" src={product.featuredImageUrl} alt={product.name} />
        </Portal>
        <Portal name={PRODUCT_ITEM_IMAGE_AFTER} props={{ productId: product.id }} />

        {/* DISCOUNT */}
        {!!product.price.discount && (
          <Fragment>
            <Portal name={PRODUCT_ITEM_DISCOUNT_BEFORE} props={{ productId: product.id }} />
            <Portal name={PRODUCT_ITEM_DISCOUNT} props={{ productId: product.id }}>
              <DiscountBadge text={`-${product.price.discount}%`} />
            </Portal>
            <Portal name={PRODUCT_ITEM_DISCOUNT_AFTER} props={{ productId: product.id }} />
          </Fragment>
        )}

      </Grid.Item>
      <Grid.Item grow={4} className={styles.titleContainer}>

        {/* NAME */}
        <Fragment>
          <Portal name={PRODUCT_ITEM_NAME_BEFORE} props={{ productId: product.id }} />
          <Portal name={PRODUCT_ITEM_NAME} props={{ productId: product.id }}>
            <div itemProp="name" data-test-id={`Productname: ${product.name}`}>
              <Ellipsis>{product.name}</Ellipsis>
            </div>
          </Portal>
          <Portal name={PRODUCT_ITEM_NAME_AFTER} props={{ productId: product.id }} />
        </Fragment>

        {/* MANUFACTURER */}
        {(!display || (display.manufacturer && product.manufacturer)) && (
          <Fragment>
            <Portal
              name={PRODUCT_ITEM_MANUFACTURER_BEFORE}
              props={{ productId: product.id }}
            />
            <Portal name={PRODUCT_ITEM_MANUFACTURER} props={{ productId: product.id }}>
              <Manufacturer text={product.manufacturer} className={styles.manufacturer} />
            </Portal>
            <Portal
              name={PRODUCT_ITEM_MANUFACTURER_AFTER}
              props={{ productId: product.id }}
            />
          </Fragment>
        )}

        {/* AVAILABILITY */}
        {product.availability && (
          <Fragment>
            <Portal
              name={PRODUCT_ITEM_AVAILABILITY_BEFORE}
              props={{ productId: product.id }}
            />
            <Portal name={PRODUCT_ITEM_AVAILABILITY} props={{ productId: product.id }}>
              <Availability
                className={styles.availability}
                text={product.availability.text}
                state={product.availability.state}
              />
            </Portal>
            <Portal
              name={PRODUCT_ITEM_AVAILABILITY_AFTER}
              props={{ productId: product.id }}
            />
          </Fragment>
        )}

      </Grid.Item>

      {/* PRICE - STRIKE PRICE - PRICE INFO */}
      {(!display || display.price) && (
        <Fragment>
          <Portal
            name={PRODUCT_ITEM_PRICE_BEFORE}
            props={{ productId: product.id, location: 'productList' }}
          />
          <Portal
            name={PRODUCT_ITEM_PRICE}
            props={{ productId: product.id, location: 'productList' }}
          >
            <Grid.Item grow={1} className={styles.priceContainer}>
              <Portal
                name={PRODUCT_ITEM_PRICE_INSIDE_BEFORE}
                props={{ productId: product.id }}
              />
              <Price
                className={styles.price}
                currency={product.price.currency}
                discounted={!!product.price.discount}
                unitPrice={product.price.unitPrice}
                unitPriceMin={product.price.unitPriceMin}
              />
              {(product.price.msrp > 0 && product.price.unitPrice !== product.price.msrp) && (
                <PriceStriked
                  value={product.price.msrp}
                  currency={product.price.currency}
                  className={styles.priceStriked}
                />
              )}
              {(!product.price.msrp && product.price.unitPriceStriked > 0) && (
                <PriceStriked
                  value={product.price.unitPriceStriked}
                  currency={product.price.currency}
                  className={styles.priceStriked}
                />
              )}
              {product.price.info && (
                <PriceInfo text={product.price.info} className={styles.priceInfo} />
              )}
              <Portal
                name={PRODUCT_ITEM_PRICE_INSIDE_AFTER}
                props={{ productId: product.id }}
              />
            </Grid.Item>
          </Portal>
          <Portal
            name={PRODUCT_ITEM_PRICE_AFTER}
            props={{ productId: product.id, location: 'productList' }}
          />
        </Fragment>
      )}

      <Grid.Item shrink={0} className={styles.favouriteContainer} />
    </Grid>
  </Link>
);

Item.propTypes = {
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

Item.defaultProps = {
  display: null,
};

export default Item;
