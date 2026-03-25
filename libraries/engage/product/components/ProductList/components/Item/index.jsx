import React from 'react';
import PropTypes from 'prop-types';
import {
  Image, Link, Grid, Availability,
} from '@shopgate/engage/components';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import {
  ITEM_PATH,
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_ALERT,
} from '@shopgate/pwa-common-commerce/product/constants/index';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import Manufacturer from '@shopgate/pwa-ui-shared/Manufacturer';
import { PriceInfo, ProductName, ProductBadges } from '@shopgate/engage/product';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const elementPadding = variables.gap.big / 2;
const containerPaddingSidewards = {
  padding: elementPadding,
};

const useStyles = makeStyles()({
  listItemContainer: {
    padding: elementPadding,
    background: colors.light,
  },
  imageContainer: {
    ...containerPaddingSidewards,
    width: 40,
    minHeight: 40,
    boxSizing: 'content-box',
  },
  titleContainer: {
    ...containerPaddingSidewards,
    lineHeight: 1.35,
    width: '50%',
  },
  priceContainer: {
    ...containerPaddingSidewards,
    lineHeight: 1.35,
    textAlign: 'right',
  },
  favouriteContainer: {
    display: 'none',
    width: 40,
  },
  availability: {
    fontSize: '0.75rem',
  },
  manufacturer: {
    fontSize: '0.875rem',
  },
  price: {
    justifyContent: 'flex-end',
  },
  priceStriked: {
    fontSize: '0.875rem',
  },
  priceInfo: {
    fontSize: '0.75rem',
  },
  discount: {
    minWidth: 40,
  },
});

/**
 * The Product List Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ display, product }) => {
  const { classes } = useStyles();

  return (
    <Link
      tagName="a"
      href={`${ITEM_PATH}/${bin2hex(product.id)}`}
      className="engage__product__product-list__item"
      itemProp="item"
      itemScope
      itemType="http://schema.org/Product"
    >
      <Grid className={classes.listItemContainer}>
        <Grid.Item shrink={0} className={classes.imageContainer}>

          {/* IMAGE */}
          <Portal name={portals.PRODUCT_ITEM_IMAGE_BEFORE} props={{ productId: product.id }} />
          <Portal name={portals.PRODUCT_ITEM_IMAGE} props={{ productId: product.id }}>
            <Image itemProp="image" src={product.featuredImageBaseUrl} alt={product.name} />
          </Portal>
          <Portal name={portals.PRODUCT_ITEM_IMAGE_AFTER} props={{ productId: product.id }} />
          <ProductBadges location="productList" productId={product.id}>
            {/* DISCOUNT */}
            {!!product.price.discount && (
            <>
              <Portal
                name={portals.PRODUCT_ITEM_DISCOUNT_BEFORE}
                props={{ productId: product.id }}
              />
              <Portal
                name={portals.PRODUCT_ITEM_DISCOUNT}
                props={{ productId: product.id }}
              >
                <DiscountBadge className={classes.discount} text={`-${product.price.discount}%`} />
              </Portal>
              <Portal
                name={portals.PRODUCT_ITEM_DISCOUNT_AFTER}
                props={{ productId: product.id }}
              />
            </>
            )}
          </ProductBadges>
        </Grid.Item>
        <Grid.Item grow={4} className={classes.titleContainer}>

          {/* NAME */}
          <ProductName
            name={product.name}
            portalName={portals.PRODUCT_ITEM_NAME}
            portalProps={{ productId: product.id }}
            itemProp="name"
            testId={`Productname: ${product.name}`}
          />

          {/* MANUFACTURER */}
          {(!display || (display.manufacturer && product.manufacturer)) && (
          <>
            <Portal
              name={portals.PRODUCT_ITEM_MANUFACTURER_BEFORE}
              props={{ productId: product.id }}
            />
            <Portal name={portals.PRODUCT_ITEM_MANUFACTURER} props={{ productId: product.id }}>
              <Manufacturer text={product.manufacturer} className={classes.manufacturer} />
            </Portal>
            <Portal
              name={portals.PRODUCT_ITEM_MANUFACTURER_AFTER}
              props={{ productId: product.id }}
            />
          </>
          )}

          {/* AVAILABILITY */}
          {product.availability && (
          <>
            <Portal
              name={portals.PRODUCT_ITEM_AVAILABILITY_BEFORE}
              props={{ productId: product.id }}
            />
            <Portal name={portals.PRODUCT_ITEM_AVAILABILITY} props={{ productId: product.id }}>
              <Availability
                className={classes.availability}
                text={product.availability.text}
                state={product.availability.state}
              />
            </Portal>
            <Portal
              name={portals.PRODUCT_ITEM_AVAILABILITY_AFTER}
              props={{ productId: product.id }}
            />
          </>
          )}

          {(!product.availability || product.availability.state === AVAILABILITY_STATE_OK) && (
            <Availability
              state={!product.stock || product.stock.orderable
                ? AVAILABILITY_STATE_OK
                : AVAILABILITY_STATE_ALERT}
              text={i18n.text('product.available.not')}
              showWhenAvailable={false}
            />
          )}

        </Grid.Item>

        {/* PRICE - STRIKE PRICE - PRICE INFO */}
        {(!display || display.price) && (
        <>
          <Portal
            name={portals.PRODUCT_ITEM_PRICE_BEFORE}
            props={{
              productId: product.id,
              location: 'productList',
            }}
          />
          <Portal
            name={portals.PRODUCT_ITEM_PRICE}
            props={{
              productId: product.id,
              location: 'productList',
            }}
          >
            <Grid.Item grow={1} className={classes.priceContainer}>
              <Portal
                name={portals.PRODUCT_ITEM_PRICE_INSIDE_BEFORE}
                props={{ productId: product.id }}
              />
              <Price
                className={classes.price}
                currency={product.price.currency}
                discounted={!!product.price.discount}
                unitPrice={product.price.unitPrice}
                unitPriceMin={product.price.unitPriceMin}
                unitPriceMax={product.price.unitPriceMax}
              />
              {(product.price.msrp > 0 && product.price.unitPrice !== product.price.msrp) && (
                <PriceStriked
                  value={product.price.msrp}
                  currency={product.price.currency}
                  className={classes.priceStriked}
                />
              )}
              {(!product.price.msrp && product.price.unitPriceStriked > 0) && (
                <PriceStriked
                  value={product.price.unitPriceStriked}
                  currency={product.price.currency}
                  className={classes.priceStriked}
                />
              )}
              <PriceInfo product={product} className={classes.priceInfo} />
              <Portal
                name={portals.PRODUCT_ITEM_PRICE_INSIDE_AFTER}
                props={{ productId: product.id }}
              />
            </Grid.Item>
          </Portal>
          <Portal
            name={portals.PRODUCT_ITEM_PRICE_AFTER}
            props={{
              productId: product.id,
              location: 'productList',
            }}
          />
        </>
        )}
        <Grid.Item shrink={0} className={classes.favouriteContainer} />
      </Grid>
    </Link>
  );
};

Item.propTypes = {
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

Item.defaultProps = {
  display: null,
};

export default Item;
