// @flow
import * as React from 'react';
import PT from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_ITEM_IMAGE,
  CART_ITEM_NAME,
  CART_ITEM_COUPON_CODE,
  CART_ITEM_PRICE,
} from '@shopgate/pwa-common-commerce/cart';
import Grid from '@shopgate/pwa-common/components/Grid';
import { type Coupon } from '../../cart.types';
import { CartItemCouponIcon } from './CartItemCouponIcon';
import { CartItemCouponPrice } from './CartItemCouponPrice';
import { CartItemCouponFreeShipping } from './CartItemCouponFreeShipping';
import { CartItemCouponTitle } from './CartItemCouponTitle';
import { CartItemCouponCode } from './CartItemCouponCode';
import { CartItemCouponDelete } from './CartItemCouponDelete';
import {
  item, icon, content, contentLast,
} from './CartItemCouponLayout.style';

type Props = {
  coupon: Coupon,
  currency: string,
  handleDelete?: (event: SyntheticEvent<HTMLButtonElement>) => void,
}

type ContextProps = {
  cartItemId: string,
  type: string,
  editable?: boolean
}

/**
 * The CouponLayout component.
 * @param {Object} props The component properties.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
export function CartItemCouponLayout(props: Props, context: ContextProps) {
  const { coupon, currency, handleDelete } = props;

  return (
    <Grid className={item}>
      <Grid.Item className={icon}>
        <SurroundPortals portalName={CART_ITEM_IMAGE} portalProps={context}>
          <CartItemCouponIcon />
        </SurroundPortals>
      </Grid.Item>
      <Grid.Item className={content} grow={1}>
        <SurroundPortals portalName={CART_ITEM_NAME} portalProps={context}>
          <CartItemCouponTitle value={coupon.label} />
        </SurroundPortals>
        <SurroundPortals portalName={CART_ITEM_COUPON_CODE} portalProps={context}>
          <CartItemCouponCode value={coupon.code} />
        </SurroundPortals>
      </Grid.Item>
      <Grid.Item className={`${content} ${contentLast}`} grow={1} shrink={0}>
        {context.editable && (
          <CartItemCouponDelete handleDelete={handleDelete} />
        )}

        <CartItemCouponFreeShipping freeShipping={!!coupon.freeShipping} />
        {(coupon.savedPrice && coupon.savedPrice.value > 0) && (
          <SurroundPortals portalName={CART_ITEM_PRICE} portalProps={context}>
            <CartItemCouponPrice currency={currency} savedPrice={coupon.savedPrice} />
          </SurroundPortals>
        )}
      </Grid.Item>
    </Grid>
  );
}

CartItemCouponLayout.defaultProps = {
  handleDelete: () => { },
};

CartItemCouponLayout.contextTypes = {
  cartItemId: PT.string,
  type: PT.string,
  editable: PT.bool,
};
