import * as React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import {
  CART_ITEM_IMAGE,
  CART_ITEM_NAME,
  CART_ITEM_COUPON_CODE,
  CART_ITEM_PRICE,
} from '@shopgate/pwa-common-commerce/cart';
import Grid from '@shopgate/pwa-common/components/Grid';
import { CartItemCouponIcon } from './CartItemCouponIcon';
import { CartItemCouponPrice } from './CartItemCouponPrice';
import { CartItemCouponFreeShipping } from './CartItemCouponFreeShipping';
import { CartItemCouponTitle } from './CartItemCouponTitle';
import { CartItemCouponCode } from './CartItemCouponCode';
import { CartItemCouponDelete } from './CartItemCouponDelete';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  item: {
    fontSize: '0.875rem',
    padding: `${variables.gap.small / 2}px ${variables.gap.big}px`,
  },
  icon: {
    fontSize: '3rem',
    flexShrink: 0,
    margin: '5px 12px 0 12px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: variables.gap.big,
    paddingTop: variables.gap.small,
    paddingBottom: variables.gap.small,
    // Ensure long coupon codes do not break layout.
    minWidth: 0,
  },
  contentLast: {
    alignItems: 'flex-end',
  },
});

/**
 * The CouponLayout component.
 * @param {Object} props The component properties.
 * @param {Object} props.coupon The coupon details.
 * @param {string} props.currency The currency to display.
 * @param {Function} [props.handleDelete] The delete handler function.
 * @param {Object} context The component context.
 * @param {string} context.cartItemId The cart item ID.
 * @param {string} context.type The type of the cart item.
 * @param {boolean} [context.editable] Whether the item is editable.
 * @returns {JSX.Element}
 */
export function CartItemCouponLayout(props, context) {
  const { classes, cx } = useStyles();
  const { coupon, currency, handleDelete } = props;

  return (
    <Grid className={classes.item}>
      <Grid.Item className={classes.icon}>
        <SurroundPortals portalName={CART_ITEM_IMAGE} portalProps={context}>
          <CartItemCouponIcon />
        </SurroundPortals>
      </Grid.Item>
      <Grid.Item className={classes.content} grow={1}>
        <SurroundPortals portalName={CART_ITEM_NAME} portalProps={context}>
          <CartItemCouponTitle value={coupon.label} />
        </SurroundPortals>
        <SurroundPortals portalName={CART_ITEM_COUPON_CODE} portalProps={context}>
          <CartItemCouponCode value={coupon.code} />
        </SurroundPortals>
      </Grid.Item>
      <Grid.Item className={cx(classes.content, classes.contentLast)} grow={1} shrink={0}>
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
  handleDelete: () => {},
};

CartItemCouponLayout.propTypes = {
  coupon: PropTypes.shape({
    label: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    freeShipping: PropTypes.bool,
    savedPrice: PropTypes.shape({
      value: PropTypes.number.isRequired,
    }),
  }).isRequired,
  currency: PropTypes.string.isRequired,
  handleDelete: PropTypes.func,
};

CartItemCouponLayout.contextTypes = {
  cartItemId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  editable: PropTypes.bool,
};
