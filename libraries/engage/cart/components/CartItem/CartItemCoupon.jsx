import * as React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { CART_ITEM_TYPE_COUPON } from '@shopgate/pwa-common-commerce/cart';
import { getPageSettings } from '@shopgate/engage/core/config';
import { MessageBar, CardList } from '@shopgate/engage/components';
import {
  container,
  cartItemTransitionDuration as duration,
  getCartItemTransitionStyle as getTransitionStyle,
} from './CartItemCoupon.style';
import {
  messagesContainerCard,
  messagesCard,
  messagesContainerLine,
  messagesLine,
} from './CartItem.style';
import connect from './CartItemCoupon.connector';
import { CartItemCouponLayout } from './CartItemCouponLayout';

/**
 * @typedef {import('./CartItemCoupon.types').OwnProps} OwnProps
 * @typedef {import('./CartItemCoupon.types').StateProps} StateProps
 * @typedef {import('./CartItemCoupon.types').DispatchProps} DispatchProps
 * @typedef {OwnProps & StateProps & DispatchProps} Props
 */

/**
 * @typedef {Object} State
 * @property {boolean} visible Whether the coupon is visible.
 */

const messageStyles = {
  card: {
    container: messagesContainerCard,
    message: messagesCard,
  },
  line: {
    container: messagesContainerLine,
    message: messagesLine,
  },
};

/**
 * The Coupon component.
 */
class CartItemCoupon extends React.PureComponent {
  static childContextTypes = {
    cartItemId: PropTypes.string,
    type: PropTypes.string,
    editable: PropTypes.bool,
  };

  static propTypes = {
    coupon: PropTypes.shape().isRequired,
    currency: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(PropTypes.any).isRequired,
    deleteCoupon: PropTypes.func,
    editable: PropTypes.bool,
  };

  static defaultProps = {
    editable: true,
    deleteCoupon: () => {},
  };

  /**
   * @type {State}
   */
  state = { visible: true };

  /**
   * @returns {Object}
   */
  getChildContext() {
    const { id, editable } = this.props;
    return {
      cartItemId: id,
      type: CART_ITEM_TYPE_COUPON,
      editable,
    };
  }

  /**
   * Updates transition height on mount/update.
   */
  componentDidMount() {
    this.updateHeight();
  }

  /**
   * We need to set the element height explicitly so that we can animate it later.
   */
  componentDidUpdate() {
    this.updateHeight();
  }

  /**
   * Updates transition height on mount/update.
   */
  updateHeight = () => {
    if (this.transitionElement && this.cardElement) {
      this.transitionElement.style.height = `${getAbsoluteHeight(this.cardElement)}px`;
    }
  };

  transitionElement = null;

  cardElement = null;

  /**
   * Hides the coupon via transition.
   * @returns {Function}
   */
  transitionOut = () => this.setState({ visible: false });

  /**
   * Removes the coupon from the cart.
   */
  deleteCoupon = () => {
    const { deleteCoupon, id } = this.props;
    deleteCoupon(id);
  };

  /**
   * @returns {JSX.Element}
   */
  render() {
    const { coupon, currency, messages } = this.props;
    const { visible } = this.state;
    const { cartItemsDisplay = 'line' } = getPageSettings(CART_PATH);
    const messageStyle = messageStyles[cartItemsDisplay];

    return (
      <Transition in={visible} timeout={duration} onExited={this.deleteCoupon}>
        {state => (
          <div
            ref={(element) => { this.transitionElement = element; }}
            key={this.props.id}
            style={getTransitionStyle(state)}
          >
            <div
              className={container}
              ref={(el) => { this.cardElement = el; }}
            >
              <CardList.Item>
                {!!messages.length && (
                  <MessageBar
                    messages={messages}
                    classNames={messageStyle}
                  />
                )}
                <CartItemCouponLayout
                  handleDelete={this.transitionOut}
                  coupon={coupon}
                  currency={currency}
                />
              </CardList.Item>
            </div>
          </div>
        )}
      </Transition>
    );
  }
}

export default connect(CartItemCoupon);
