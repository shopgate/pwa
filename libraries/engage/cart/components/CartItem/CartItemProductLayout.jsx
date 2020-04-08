// @flow
import * as React from 'react';
import PT from 'prop-types';
import {
  Grid, Link, ProductProperties, PriceInfo, SurroundPortals,
} from '@shopgate/engage/components';
import { CART_ITEM_IMAGE } from '@shopgate/pwa-common-commerce/cart';
import { showTaxDisclaimer } from '@shopgate/engage/market';
import { bin2hex } from '@shopgate/engage/core';
import { ProductImage, ITEM_PATH, type Product } from '@shopgate/engage/product';
import {
  CartItemProductChangeLocation,
  CartChangeFulfillmentMethod,
} from '@shopgate/engage/locations';
import { type Item } from '../../cart.types';
import { CartItemQuantityPicker } from './CartItemQuantityPicker';
import { CartItemProductTitle } from './CartItemProductTitle';
import { CartItemProductPrice } from './CartItemProductPrice';
import styles from './CartItemProductLayout.style';

type Props = {
  currency: string,
  editMode: boolean,
  product: Product,
  quantity: number,
  handleDelete?: () => void,
  handleUpdate?: (quantity: number) => void,
  toggleEditMode?: () => void,
}

type ContextProps = {
  registerAction: () => void,
  cartItem?: Item,
  cartItemId?: string,
  type?: string,
  editable?: boolean
}

/**
 * The Cart Product Layout component.
 * @param {Object} props The component properties.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
export function CartItemProductLayout(props: Props, context: ContextProps) {
  const { cartItem, registerAction } = context;

  return (
    <React.Fragment>
      <Grid className={styles.item}>
        <Grid.Item className={styles.content} grow={1}>
          <Link tagName="a" href={`${ITEM_PATH}/${bin2hex(props.product.id)}`}>
            <CartItemProductTitle
              handleRemove={props.handleDelete}
              toggleEditMode={props.toggleEditMode}
              value={props.product.name}
            />
          </Link>
          <Grid className={styles.info}>
            <Grid.Item grow={1} className={styles.properties}>
              <ProductProperties properties={props.product.properties} lineClamp={2} />
            </Grid.Item>
            <Grid.Item grow={1} className={styles.price}>
              <CartItemProductPrice
                currency={props.currency}
                defaultPrice={props.product.price.default}
                specialPrice={props.product.price.special}
              />
              {props.product.price.info && (
                <PriceInfo className={styles.priceInfo} text={props.product.price.info} />
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
            <Link tagName="a" href={`${ITEM_PATH}/${bin2hex(props.product.id)}`}>
              <SurroundPortals portalName={CART_ITEM_IMAGE} portalProps={context}>
                <ProductImage src={props.product.featuredImageUrl} />
              </SurroundPortals>
            </Link>
          </div>
          {context.editable && (
            <CartItemQuantityPicker
              quantity={props.quantity}
              editMode={props.editMode}
              onChange={props.handleUpdate}
              onToggleEditMode={props.toggleEditMode}
            />
          )}

        </Grid.Item>
      </Grid>
      <CartItemProductChangeLocation cartItem={cartItem} registerAction={registerAction} />
      <CartChangeFulfillmentMethod cartItem={cartItem} registerAction={registerAction} />
    </React.Fragment>
  );
}

CartItemProductLayout.defaultProps = {
  handleDelete: () => { },
  handleUpdate: () => { },
  toggleEditMode: () => { },
};

CartItemProductLayout.contextTypes = {
  registerAction: PT.func,
  cartItem: PT.shape(),
  cartItemId: PT.string,
  type: PT.string,
  editable: PT.bool,
};
