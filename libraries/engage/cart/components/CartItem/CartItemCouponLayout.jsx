import * as React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import {
  CART_ITEM_IMAGE,
  CART_ITEM_NAME,
  CART_ITEM_COUPON_CODE,
  CART_ITEM_PRICE,
  CART_ITEM_TYPE_COUPON,
} from '@shopgate/pwa-common-commerce/cart';
import Grid from '@shopgate/pwa-common/components/Grid';
import { CartItemCouponIcon } from './CartItemCouponIcon';
import { CartItemCouponPrice } from './CartItemCouponPrice';
import { CartItemCouponFreeShipping } from './CartItemCouponFreeShipping';
import { CartItemCouponTitle } from './CartItemCouponTitle';
import { CartItemCouponCode } from './CartItemCouponCode';
import { CartItemCouponDelete } from './CartItemCouponDelete';

/** @type {React.Context<{ cartItemId: string, type: string, editable?: boolean }>} */
export const CartItemCouponLayoutContext = React.createContext({
  cartItemId: '',
  type: CART_ITEM_TYPE_COUPON,
  editable: true,
});

const useStyles = makeStyles()(theme => ({
  item: {
    fontSize: '0.875rem',
    padding: theme.spacing(0.5, 2),
  },
  icon: {
    fontSize: '3rem',
    flexShrink: 0,
    margin: '5px 12px 0 12px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    // Ensure long coupon codes do not break layout.
    minWidth: 0,
  },
  contentLast: {
    alignItems: 'flex-end',
  },
}));

/**
 * The CartItemCouponLayout component.
 * @param {Object} props The component properties.
 * @param {Object} props.coupon The coupon details.
 * @param {string} props.currency The currency to display.
 * @param {Function} [props.handleDelete] The delete handler function.
 * @returns {JSX.Element}
 */
export function CartItemCouponLayout(props) {
  const context = React.useContext(CartItemCouponLayoutContext);
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
