import React, {
  useMemo, useCallback, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import {
  getCartConfig,
  sortCartItems,
  CART_PATH,
  CART_ITEM_LIST,
  CART_COUPON_FIELD,
  PaymentBar,
  PaymentBarTotals,
  CartContext,
  FLAG_MULTI_LINE_RESERVE,
  CartItemGroup,
  CartItems,
  CartItem,
} from '@shopgate/engage/cart';
import {
  MessageBar, CardList, SurroundPortals, Card,
} from '@shopgate/engage/components';
import { FulfillmentSheet } from '@shopgate/engage/locations';
import { BackBar } from 'Components/AppBar/presets';
import { getPageSettings } from '@shopgate/engage/core/config';
import { ProductListTypeProvider } from '@shopgate/engage/product';
import { makeStyles, useMediaQuery } from '@shopgate/engage/styles';
import { getCartPaymentBarSettings } from '@shopgate/engage/settings/selectors/appSettings';
import { useFooterBarLayout } from '../../../../components/TabBar/hooks';
import CouponField from '../CouponField';
import Empty from '../Empty';
import Footer from '../Footer';
import Summary, { SUMMARY_MAX_WIDTH } from '../Summary';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  cardList: {
    marginTop: 4,
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: theme.spacing(2),
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    },
    '& > li, & > li > ul, & > li > ul > li, & [data-test-id="cartItem"]': {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
  },
  totals: {
    marginTop: 4,
    paddingBottom: theme.spacing(1),
    background: theme.palette.background.surface,
  },
  bar: {
    [theme.breakpoints.up('md')]: {
      '&&[data-variant="floating"]': {
        paddingLeft: `max(${theme.spacing(4)}px, calc(100% - ${SUMMARY_MAX_WIDTH}px - ${theme.spacing(4)}px))`,
        paddingRight: theme.spacing(4),
      },
    },
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    alignItems: 'start',
    rowGap: theme.spacing(3),
    padding: theme.spacing(1, 4, 4),
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'minmax(0, 1fr) 320px',
      columnGap: theme.spacing(4),
    },
  },
}));

const config = getCartConfig();

/**
 * The cart content container component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function CartContent(props) {
  const {
    cartItems, messages, isUserLoggedIn, currency, flags, hasPromotionCoupons, isDirectShipOnly,
  } = props;
  const { classes, cx } = useStyles();
  const isWide = useMediaQuery(theme => theme.breakpoints.up('md'));
  const hasSidebar = useMediaQuery(theme => theme.breakpoints.up('lg'));
  const [isPaymentBarVisible, setIsPaymentBarVisible] = React.useState(true);
  const { isLoading: getIsLoading } = React.useContext(LoadingContext);
  const isMountedRef = useRef(true);
  const { variant: configuredVariant } = useSelector(getCartPaymentBarSettings);
  const paymentBarLayout = useFooterBarLayout(isWide ? 'floating' : configuredVariant);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const isLoading = getIsLoading(CART_PATH);
  const hasItems = (cartItems.length > 0);
  const hasMessages = (messages.length > 0);
  const cartItemsSorted = sortCartItems(cartItems);
  const { cartItemsDisplay = 'line' } = getPageSettings(CART_PATH);

  /**
   * Toggles the visibility of the payment bar.
   * It's called when the QuantityPicker or CouponField is focused or blurred.
   * @param {boolean} isHidden Tells if the payment bar is hidden or not.
   */
  const togglePaymentBar = useCallback((isHidden) => {
    if (!isMountedRef.current) {
      return;
    }
    setIsPaymentBarVisible(!isHidden);
  }, []);

  const contextValue = useMemo(() => ({
    currency,
    config,
    isUserLoggedIn,
    isLoading,
    flags,
    hasPromotionCoupons,
    isDirectShipOnly,
  }), [currency, isUserLoggedIn, isLoading, flags, hasPromotionCoupons, isDirectShipOnly]);

  /**
   * Renders a cart item within its fulfillment group.
   * @param {Object} cartItem The cart item.
   * @returns {JSX.Element}
   */
  const renderCartItem = cartItem => (
    <CartItemGroup
      key={cartItem.id}
      fulfillmentLocationId={cartItem.fulfillmentLocationId}
      multiLineReservation={flags[FLAG_MULTI_LINE_RESERVE]}
    >
      <CartItem
        item={cartItem}
        key={cartItem.id}
        onFocus={togglePaymentBar}
      />
    </CartItemGroup>
  );

  const itemList = (
    <ProductListTypeProvider type="cart">
      <SurroundPortals portalName={CART_ITEM_LIST}>
        {(cartItemsDisplay === 'line') && isWide && (
        <ul className={cx(classes.cards, 'theme__cart__item-cards')}>
          {cartItemsSorted.map(cartItem => (
            <Card key={cartItem.id} component="li">
              <ul>
                {renderCartItem(cartItem)}
              </ul>
            </Card>
          ))}
        </ul>
        )}
        {(cartItemsDisplay === 'line') && !isWide && (
        <CardList className={classes.cardList}>
          {cartItemsSorted.map(renderCartItem)}
          <SurroundPortals portalName={CART_COUPON_FIELD}>
            <CouponField onFocus={togglePaymentBar} />
          </SurroundPortals>
        </CardList>
        )}
        {(cartItemsDisplay === 'card') && (
        <>
          <CartItems
            cartItems={cartItemsSorted}
            multiLineReservation={flags[FLAG_MULTI_LINE_RESERVE]}
            onFocus={togglePaymentBar}
          />
          {!isWide && (
            <SurroundPortals portalName={CART_COUPON_FIELD}>
              <CouponField onFocus={togglePaymentBar} />
            </SurroundPortals>
          )}
        </>
        )}
      </SurroundPortals>
    </ProductListTypeProvider>
  );

  return (
    <CartContext.Provider value={contextValue}>
      <BackBar title="titles.cart" />
      {(hasItems || hasMessages) && (
        <>
          {hasMessages && (
            <MessageBar messages={messages} />
          )}
          {hasItems && (
            <>
              {isWide ? (
                <div className={cx(classes.columns, 'theme__cart__columns')}>
                  <div className="theme__cart__items">{itemList}</div>
                  <Summary sidebar={hasSidebar} onCouponFocus={togglePaymentBar} />
                </div>
              ) : itemList}
              {!isWide && paymentBarLayout.variant === 'floating' && (
                <PaymentBarTotals className={classes.totals} showSeparator={false} />
              )}
              {!hasSidebar && (
                <PaymentBar
                  visible={isPaymentBarVisible}
                  variant={paymentBarLayout.variant}
                  gap={paymentBarLayout.gap}
                  className={classes.bar}
                />
              )}
            </>
          )}
          {!(isWide && hasItems) && <Footer />}
        </>
      )}
      {(!isLoading && !hasItems) && (
        <Empty />
      )}
      <FulfillmentSheet />
    </CartContext.Provider>
  );
}

CartContent.propTypes = {
  isUserLoggedIn: PropTypes.bool.isRequired,
  cartItems: PropTypes.arrayOf(PropTypes.shape()),
  currency: PropTypes.string,
  flags: PropTypes.shape(),
  hasPromotionCoupons: PropTypes.bool,
  isDirectShipOnly: PropTypes.bool,
  messages: PropTypes.arrayOf(PropTypes.shape()),
};

CartContent.defaultProps = {
  currency: null,
  cartItems: [],
  flags: {},
  messages: [],
  hasPromotionCoupons: false,
  isDirectShipOnly: false,
};

export default connect(React.memo(CartContent));
