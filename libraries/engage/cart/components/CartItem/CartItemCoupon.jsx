import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useMemo,
  memo,
} from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { CART_ITEM_TYPE_COUPON } from '@shopgate/pwa-common-commerce/cart';
import { getPageSettings } from '@shopgate/engage/core/config';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { MessageBar, CardList } from '@shopgate/engage/components';
import connect from './CartItemCoupon.connector';
import { CartItemCouponLayout, CartItemCouponLayoutContext } from './CartItemCouponLayout';

const { colors } = themeConfig;

const duration = 300;

const defaultTransitionStyle = {
  transition: `height ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
  opacity: 1,
};

const transitionStyles = {
  exited: {
    height: 0,
    opacity: 0,
  },
  exiting: {
    height: 0,
    opacity: 0,
  },
};

/**
 * Creates an object with style attributes to enable a cart item transition.
 * @param {string} state A state of the react-transition-group/Transition component.
 * @return {Object}
 */
const getTransitionStyle = state => ({
  ...defaultTransitionStyle,
  ...transitionStyles[state],
});

const useStyles = makeStyles()(theme => ({
  container: {
    marginBottom: 4,
  },
  messagesContainerCard: {
    background: colors.light,
    padding: theme.spacing(0, 0, 2, 0),
  },
  messagesCard: {
    borderRadius: '5px 5px 0 0',
    padding: theme.spacing(1, 1.75),
  },
  messagesContainerLine: {
    background: colors.light,
    padding: theme.spacing(2, 2, 0),
  },
  messagesLine: {
    borderRadius: 4,
    padding: theme.spacing(1, 2),
    lineHeight: 1.125,
  },
}));

/**
 * @typedef {import('./CartItemCoupon.types').OwnProps} OwnProps
 * @typedef {import('./CartItemCoupon.types').StateProps} StateProps
 * @typedef {import('./CartItemCoupon.types').DispatchProps} DispatchProps
 * @typedef {OwnProps & StateProps & DispatchProps} Props
 */

/**
 * The Coupon component.
 * @param {Props} props Props.
 * @returns {JSX.Element}
 */
const CartItemCoupon = ({
  coupon,
  currency,
  id,
  messages,
  deleteCoupon,
  editable,
}) => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(true);
  const transitionElementRef = useRef(null);
  const cardElementRef = useRef(null);

  const updateHeight = useCallback(() => {
    const transitionEl = transitionElementRef.current;
    const cardEl = cardElementRef.current;
    if (transitionEl && cardEl) {
      transitionEl.style.height = `${getAbsoluteHeight(cardEl)}px`;
    }
  }, []);

  useLayoutEffect(() => {
    updateHeight();
  });

  const transitionOut = useCallback(() => {
    setVisible(false);
  }, []);

  const handleExited = useCallback(() => {
    deleteCoupon(id);
  }, [deleteCoupon, id]);

  const { cartItemsDisplay = 'line' } = getPageSettings(CART_PATH);
  const messageStyle = {
    card: {
      container: classes.messagesContainerCard,
      message: classes.messagesCard,
    },
    line: {
      container: classes.messagesContainerLine,
      message: classes.messagesLine,
    },
  }[cartItemsDisplay];

  const layoutContextValue = useMemo(() => ({
    cartItemId: id,
    type: CART_ITEM_TYPE_COUPON,
    editable,
  }), [editable, id]);

  return (
    <Transition in={visible} timeout={duration} onExited={handleExited}>
      {state => (
        <div
          ref={transitionElementRef}
          key={id}
          style={getTransitionStyle(state)}
        >
          <div
            className={classes.container}
            ref={cardElementRef}
          >
            <CartItemCouponLayoutContext.Provider value={layoutContextValue}>
              <CardList.Item>
                {!!messages.length && (
                  <MessageBar
                    messages={messages}
                    classNames={messageStyle}
                  />
                )}
                <CartItemCouponLayout
                  handleDelete={transitionOut}
                  coupon={coupon}
                  currency={currency}
                />
              </CardList.Item>
            </CartItemCouponLayoutContext.Provider>
          </div>
        </div>
      )}
    </Transition>
  );
};

CartItemCoupon.propTypes = {
  coupon: PropTypes.shape().isRequired,
  currency: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  })).isRequired,
  deleteCoupon: PropTypes.func,
  editable: PropTypes.bool,
};

CartItemCoupon.defaultProps = {
  editable: true,
  deleteCoupon: () => {},
};

export default connect(memo(CartItemCoupon));
