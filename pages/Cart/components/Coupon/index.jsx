import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Transition from 'react-transition-group/Transition';
import { getAbsoluteHeight } from 'Library/helpers/dom';
import { CardList } from 'Templates/components';
import {
  cartItemTransitionDuration as duration,
  getCartItemTransitionStyle as getTransitionStyle,
} from '../../style';
import connect from './connectors';
import Template from './components/Layout';

/**
 * The CartCoupon component.
 */
class CartCoupon extends Component {
  static propTypes = {
    coupon: PropTypes.shape().isRequired,
    currency: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    deleteCoupon: PropTypes.func,
  };

  static defaultProps = {
    deleteCoupon: () => {},
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
   * We need to set the element height explicitly so that we can animate it later.
   */
  componentDidMount() {
    this.transitionElement.style.height = `${getAbsoluteHeight(findDOMNode(this.cardElement))}px`;
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
            <CardList.Item ref={(element) => { this.cardElement = element; }}>
              <Template
                handleDelete={this.transitionOut}
                coupon={this.props.coupon}
                currency={this.props.currency}
              />
            </CardList.Item>
          </div>
        )}
      </Transition>
    );
  }
}

export default connect(CartCoupon);
