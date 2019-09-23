import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import { CART_ITEM_TYPE_COUPON } from '@shopgate/pwa-common-commerce/cart/constants';
import { MessageBar, CardList } from '@shopgate/engage/components';
import styles from './style';
import cartStyles from '../../style';
import {
  cartItemTransitionDuration as duration,
  getCartItemTransitionStyle as getTransitionStyle,
} from '../../../../style';
import connect from './connector';
import Layout from './components/Layout';

const messageStyles = {
  container: cartStyles.messagesContainer,
  message: cartStyles.messages,
};

/**
 * The Coupon component.
 */
class Coupon extends Component {
  static propTypes = {
    coupon: PropTypes.shape().isRequired,
    currency: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    deleteCoupon: PropTypes.func,
  };

  static childContextTypes = {
    cartItemId: PropTypes.string,
    type: PropTypes.string,
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
    return (
      <Transition in={this.state.visible} timeout={duration} onExited={this.deleteCoupon}>
        {state => (
          <div
            ref={(element) => { this.transitionElement = element; }}
            key={this.props.id}
            style={getTransitionStyle(state)}
          >
            <div className={styles} ref={(element) => { this.cardElement = element; }}>
              <CardList.Item>
                {this.props.messages.length > 0 &&
                  <MessageBar messages={this.props.messages} classNames={messageStyles} />}
                <Layout
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

export default connect(Coupon);
