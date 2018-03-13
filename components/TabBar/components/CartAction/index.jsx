import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import Portal from '@shopgate/pwa-common/components/Portal';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import CartIcon from 'Components/icons/CartIcon';
import TabBarAction from '../TabBarAction';
import CartItemBadge from './components/CartItemBadge';
import styles from './style';

/**
 * The tab bar cart action.
 */
class TabBarCartAction extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    ...TabBarAction.propTypes,
  };

  static defaultProps = TabBarAction.defaultProps;

  /**
   * Handles the click action.
   */
  handleClick = () => {
    if (this.props.path === CART_PATH) {
      return;
    }

    const link = new ParsedLink(CART_PATH);
    link.open();
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return (
      <TabBarAction
        {...this.props}
        icon={(
          <Portal name="tabbar.cart-icon">
            <CartIcon className={styles} />
          </Portal>
        )}
        onClick={this.handleClick}
      >
        <CartItemBadge />
      </TabBarAction>
    );
  }
}

export default TabBarCartAction;
