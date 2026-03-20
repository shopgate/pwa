import * as React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { CART_ITEM_TYPE_COUPON } from '@shopgate/pwa-common-commerce/cart';
import { getPageSettings } from '@shopgate/engage/core/config';
import { withStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { MessageBar, CardList } from '@shopgate/engage/components';
import connect from './CartItemCoupon.connector';
import { CartItemCouponLayout } from './CartItemCouponLayout';

const { colors, variables } = themeConfig;

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
    messages: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string,
      type: PropTypes.string,
    })).isRequired,
    deleteCoupon: PropTypes.func,
    editable: PropTypes.bool,
  };

  static defaultProps = {
    editable: true,
    deleteCoupon: () => {},
  };

  /**
   * @param {Props} props The component props
   */
  constructor(props) {
    super(props);
    /**
     * @type {State}
     */
    this.state = { visible: true };
  }

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
    const classes = withStyles.getClasses(this.props);
    const { coupon, currency, messages } = this.props;
    const { visible } = this.state;
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

    return (
      <Transition in={visible} timeout={duration} onExited={this.deleteCoupon}>
        {state => (
          <div
            ref={(element) => { this.transitionElement = element; }}
            key={this.props.id}
            style={getTransitionStyle(state)}
          >
            <div
              className={classes.container}
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

export default connect(withStyles(CartItemCoupon, () => ({
  container: {
    marginBottom: 4,
  },
  messagesContainerCard: {
    background: colors.light,
    padding: `0 0 ${variables.gap.big}px 0`,
  },
  messagesCard: {
    borderRadius: '5px 5px 0 0',
    padding: `${variables.gap.small}px ${variables.gap.big * 0.875}px`,
  },
  messagesContainerLine: {
    background: colors.light,
    padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
  },
  messagesLine: {
    borderRadius: 4,
    padding: `${variables.gap.big / 2}px ${variables.gap.big}px`,
    lineHeight: 1.125,
  },
})));
