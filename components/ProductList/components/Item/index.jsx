import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Image from '@shopgate/pwa-common/components/Image';
import Link from '@shopgate/pwa-common/components/Link';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants/index';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import PriceInfo from '@shopgate/pwa-ui-shared/PriceInfo';
import Manufacturer from '@shopgate/pwa-ui-shared/Manufacturer';
import Availability from '@shopgate/pwa-ui-shared/Availability';
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
        <Portal name={portals.PRODUCT_ITEM_IMAGE_BEFORE} props={{ productId: product.id }} />
        <Portal name={portals.PRODUCT_ITEM_IMAGE} props={{ productId: product.id }}>
          <Image itemProp="image" src={product.featuredImageBaseUrl} alt={product.name} />
        </Portal>
        <Portal name={portals.PRODUCT_ITEM_IMAGE_AFTER} props={{ productId: product.id }} />

        {/* DISCOUNT */}
        {!!product.price.discount && (
          <Fragment>
            <Portal name={portals.PRODUCT_ITEM_DISCOUNT_BEFORE} props={{ productId: product.id }} />
            <Portal name={portals.PRODUCT_ITEM_DISCOUNT} props={{ productId: product.id }}>
              <DiscountBadge text={`-${product.price.discount}%`} />
            </Portal>
            <Portal name={portals.PRODUCT_ITEM_DISCOUNT_AFTER} props={{ productId: product.id }} />
          </Fragment>
        )}

      </Grid.Item>
      <Grid.Item grow={4} className={styles.titleContainer}>

        {/* NAME */}
        <Fragment>
          <Portal name={portals.PRODUCT_ITEM_NAME_BEFORE} props={{ productId: product.id }} />
          <Portal name={portals.PRODUCT_ITEM_NAME} props={{ productId: product.id }}>
            <div itemProp="name" data-test-id={`Productname: ${product.name}`}>
              <Ellipsis>{product.name}</Ellipsis>
            </div>
          </Portal>
          <Portal name={portals.PRODUCT_ITEM_NAME_AFTER} props={{ productId: product.id }} />
        </Fragment>

        {/* MANUFACTURER */}
        {(!display || (display.manufacturer && product.manufacturer)) && (
          <Fragment>
            <Portal
              name={portals.PRODUCT_ITEM_MANUFACTURER_BEFORE}
              props={{ productId: product.id }}
            />
            <Portal name={portals.PRODUCT_ITEM_MANUFACTURER} props={{ productId: product.id }}>
              <Manufacturer text={product.manufacturer} className={styles.manufacturer} />
            </Portal>
            <Portal
              name={portals.PRODUCT_ITEM_MANUFACTURER_AFTER}
              props={{ productId: product.id }}
            />
          </Fragment>
        )}

        {/* AVAILABILITY */}
        {product.availability && (
          <Fragment>
            <Portal
              name={portals.PRODUCT_ITEM_AVAILABILITY_BEFORE}
              props={{ productId: product.id }}
            />
            <Portal name={portals.PRODUCT_ITEM_AVAILABILITY} props={{ productId: product.id }}>
              <Availability
                className={styles.availability}
                text={product.availability.text}
                state={product.availability.state}
              />
            </Portal>
            <Portal
              name={portals.PRODUCT_ITEM_AVAILABILITY_AFTER}
              props={{ productId: product.id }}
            />
          </Fragment>
        )}

      </Grid.Item>

      {/* PRICE - STRIKE PRICE - PRICE INFO */}
      {(!display || display.price) && (
        <Fragment>
          <Portal
            name={portals.PRODUCT_ITEM_PRICE_BEFORE}
            props={{ productId: product.id, location: 'productList' }}
          />
          <Portal
            name={portals.PRODUCT_ITEM_PRICE}
            props={{ productId: product.id, location: 'productList' }}
          >
            <Grid.Item grow={1} className={styles.priceContainer}>
              <Portal
                name={portals.PRODUCT_ITEM_PRICE_INSIDE_BEFORE}
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
                name={portals.PRODUCT_ITEM_PRICE_INSIDE_AFTER}
                props={{ productId: product.id }}
              />
            </Grid.Item>
          </Portal>
          <Portal
            name={portals.PRODUCT_ITEM_PRICE_AFTER}
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
