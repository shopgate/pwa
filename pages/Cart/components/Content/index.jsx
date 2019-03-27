import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import * as portals from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { getShippingConfig } from '@shopgate/pwa-common-commerce/cart';
import CardList from '@shopgate/pwa-ui-shared/CardList';
import MessageBar from '@shopgate/pwa-ui-shared/MessageBar';
import { BackBar } from 'Components/AppBar/presets';
import Item from '../Item';
import CouponField from '../CouponField';
import Empty from '../Empty';
import Footer from '../Footer';
import PaymentBar from '../PaymentBar';
import connect from './connector';
import styles from './style';
import CartContext from '../../context';

const contextValue = {
  shipping: getShippingConfig(),
};

/**
 * The cart content container component.
 */
class CartContentContainer extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    cartItems: PropTypes.arrayOf(PropTypes.shape()),
    messages: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    cartItems: [],
    messages: [],
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      isPaymentBarVisible: true,
    };
  }

  /**
   * Toggles the visibility of the payment bar.
   * It's called when the QuantityPicker or CouponField is focused or blurred.
   * @param {boolean} isHidden Tells if the payment bar is hidden or not.
   */
  togglePaymentBar = (isHidden) => {
    this.setState({
      isPaymentBarVisible: !isHidden,
    });
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { cartItems, isLoading, messages } = this.props;
    const { isPaymentBarVisible } = this.state;
    const hasItems = (cartItems.length > 0);
    const hasMessages = (messages.length > 0);

    return (
      <CartContext.Provider value={contextValue}>
        <BackBar title="titles.cart" />
        {(hasItems || hasMessages) && (
          <Fragment>
            {hasMessages && <MessageBar messages={messages} />}
            {hasItems && (
              <Fragment>
                <Portal name={portals.CART_ITEM_LIST_BEFORE} />
                <Portal name={portals.CART_ITEM_LIST}>
                  <CardList className={styles}>
                    {cartItems.map(cartItem => (
                      <Item
                        item={cartItem}
                        key={cartItem.id}
                        onFocus={this.togglePaymentBar}
                      />
                    ))}
                    <Portal name={portals.CART_COUPON_FIELD_BEFORE} />
                    <Portal name={portals.CART_COUPON_FIELD} >
                      <CouponField onFocus={this.togglePaymentBar} />
                    </Portal>
                    <Portal name={portals.CART_COUPON_FIELD_AFTER} />
                  </CardList>
                </Portal>
                <Portal name={portals.CART_ITEM_LIST_AFTER} />
                <PaymentBar visible={isPaymentBarVisible} />
              </Fragment>
            )}
            <Footer />
          </Fragment>
        )}
        {(!isLoading && !hasItems) && <Empty />}
      </CartContext.Provider>
    );
  }
}

/**
 * The cart content component.
 * @param {Object} props The component props.
 * @returns {React.Node}
 */
function CartContent(props) {
  return (
    <LoadingContext.Consumer>
      {({ isLoading }) => <CartContentContainer {...props} isLoading={isLoading(CART_PATH)} />}
    </LoadingContext.Consumer>
  );
}

export default connect(CartContent);
