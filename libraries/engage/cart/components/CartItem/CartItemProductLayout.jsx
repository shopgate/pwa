// @flow
import React from 'react';
import {
  Grid, Link, TextLink, ProductProperties, PriceInfo, SurroundPortals,
} from '@shopgate/engage/components';
import { CART_ITEM_IMAGE } from '@shopgate/pwa-common-commerce/cart';
import { showTaxDisclaimer } from '@shopgate/engage/market';
import { bin2hex } from '@shopgate/engage/core';
import { ProductImage, ITEM_PATH } from '@shopgate/engage/product';
import {
  CartItemProductChangeLocation,
  CartChangeFulfillmentMethod,
} from '@shopgate/engage/locations';
import { CartItemQuantityPicker } from './CartItemQuantityPicker';
import { CartItemProductTitle } from './CartItemProductTitle';
import { CartItemProductPrice } from './CartItemProductPrice';
import { useCartItem, useCartItemProduct } from './CartItem.hooks';
import styles from './CartItemProductLayout.style';

/**
 * The Cart Product Layout component.
 * @returns {JSX}
 */
export function CartItemProductLayout() {
  const { registerFulfillmentAction } = useCartItem();
  const context = useCartItemProduct();
  const {
    cartItem,
    product,
    currency,
    editMode,
    handleUpdate,
    toggleEditMode,
    isEditable,
  } = context;

  return (
    <React.Fragment>
      <Grid className={styles.item}>
        <Grid.Item className={styles.content} grow={1}>
          <TextLink href={`${ITEM_PATH}/${bin2hex(product.id)}`}>
            <CartItemProductTitle value={product.name} />
          </TextLink>
          <Grid className={styles.info}>
            <Grid.Item grow={1} className={styles.properties}>
              <ProductProperties properties={product.properties} lineClamp={2} />
            </Grid.Item>
            <Grid.Item grow={1} className={styles.price}>
              <CartItemProductPrice
                currency={currency}
                defaultPrice={product.price.default}
                specialPrice={product.price.special}
              />
              {product.price.info && (
                <PriceInfo className={styles.priceInfo} text={product.price.info} />
              )}
            </Grid.Item>
            {showTaxDisclaimer && (
              <Grid.Item
                className={styles.disclaimerSpacer}
                grow={0}
                shrink={0}
              />
            )}
          </Grid>
        </Grid.Item>
        {/** DOM reversed for a11y navigation */}
        <Grid.Item className={styles.leftColumn}>
          <div className={styles.image} aria-hidden>
            <Link tagName="a" href={`${ITEM_PATH}/${bin2hex(product.id)}`}>
              <SurroundPortals portalName={CART_ITEM_IMAGE} portalProps={context}>
                <ProductImage src={product.featuredImageUrl} />
              </SurroundPortals>
            </Link>
          </div>
          <CartItemQuantityPicker
            unit={product.unit}
            quantity={cartItem.quantity}
            editMode={editMode}
            onChange={handleUpdate}
            onToggleEditMode={toggleEditMode}
            disabled={!isEditable}
          />
        </Grid.Item>
      </Grid>
      <CartItemProductChangeLocation
        cartItem={cartItem}
        registerAction={registerFulfillmentAction}
      />
      <CartChangeFulfillmentMethod
        cartItem={cartItem}
        registerAction={registerFulfillmentAction}
      />
    </React.Fragment>
  );
}
