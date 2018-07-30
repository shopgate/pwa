import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import Portal from '@shopgate/pwa-common/components/Portal';
import CartIcon from '@shopgate/pwa-ui-ios/icons/CartIcon';
import * as portals from '../../constants';
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
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return (
      <Fragment>
        <Portal name={portals.TAB_BAR_CART_BEFORE} props={this.props} />
        <Portal
          name={portals.TAB_BAR_CART}
          props={{
            ...this.props,
            TabBarAction,
          }}
        >
          <TabBarAction
            {...this.props}
            icon={(
              <Portal name={portals.TAB_BAR_CART_ICON}>
                <CartIcon className={styles} />
              </Portal>
            )}
            onClick={this.handleClick}
          >
            <CartItemBadge />
          </TabBarAction>
        </Portal>
        <Portal
          name={portals.TAB_BAR_CART_AFTER}
          props={{
            ...this.props,
            TabBarAction,
          }}
        />
      </Fragment>
    );
  }
}

export default TabBarCartAction;
