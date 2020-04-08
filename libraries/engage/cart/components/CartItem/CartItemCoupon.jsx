// @flow
import * as React from 'react';
import PT from 'prop-types';
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
import { type OwnProps, type StateProps, type DispatchProps } from './CartItemCoupon.types';

type Props = OwnProps & StateProps & DispatchProps;

type State = {
  visible: boolean,
}

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
class CartItemCoupon extends React.Component<Props, State> {
  static childContextTypes = {
    cartItemId: PT.string,
    type: PT.string,
    editable: PT.bool,
  };

  static defaultProps = {
    deleteCoupon: () => { },
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };
  }

  /**
   * Expose props to the descendant components to use them for the portals.
   * @return {Object}
   */
  getChildContext() {
    return {
      cartItemId: this.props.id,
      type: CART_ITEM_TYPE_COUPON,
      editable: this.props.editable,
    };
  }

  /**
   * We need to set the element height explicitly so that we can animate it later.
   */
  componentDidMount() {
    this.transitionElement.style.height = `${getAbsoluteHeight(this.cardElement)}px`;
  }

  /**
   * We need to set the element height explicitly so that we can animate it later.
   */
  componentDidUpdate() {
    this.transitionElement.style.height = `${getAbsoluteHeight(this.cardElement)}px`;
  }

  transitionElement: HTMLElement;

  cardElement: HTMLElement;

  /**
   * Sets this coupon to be invisible via its state.
   */
  transitionOut = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   * Deletes the coupon from the cart.
   */
  deleteCoupon = () => {
    this.props.deleteCoupon(this.props.id);
  };

  /**
   * Render Function.
   * @returns {JSX}
   */
  render() {
    const { cartItemsDisplay = 'line' } = getPageSettings(CART_PATH);

    return (
      <Transition in={this.state.visible} timeout={duration} onExited={this.deleteCoupon}>
        {state => (
          <div
            ref={(element) => { if (element) this.transitionElement = element; }}
            key={this.props.id}
            style={getTransitionStyle(state)}
          >
            <div
              className={container}
              ref={(element) => { if (element) this.cardElement = element; }}
            >
              <CardList.Item>
                {this.props.messages.length > 0 &&
                  <MessageBar
                    messages={this.props.messages}
                    classNames={messageStyles[cartItemsDisplay]}
                  />}
                <CartItemCouponLayout
                  handleDelete={this.transitionOut}
                  coupon={this.props.coupon}
                  currency={this.props.currency}
                />
              </CardList.Item>
            </div>
          </div>
        )}
      </Transition>
    );
  }
}

CartItemCoupon.defaultProps = {
  editable: true,
};

export default connect(CartItemCoupon);
