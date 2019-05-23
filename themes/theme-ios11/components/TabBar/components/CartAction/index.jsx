import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CART_PATH } from '@shopgate/engage/cart';
import { Portal } from '@shopgate/engage/components';
import CartIcon from '@shopgate/pwa-ui-ios/icons/CartIcon';
import * as portals from '../../constants';
import TabBarAction from '../TabBarAction';
import CartItemBadge from './components/CartItemBadge';
import connect from '../connector';
import styles from './style';

/**
 * The tab bar cart action.
 */
class TabBarCartAction extends Component {
  static propTypes = {
    historyPush: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    ...TabBarAction.propTypes,
  };

  static defaultProps = TabBarAction.defaultProps;

  /**
   * Handles the click action.
   */
  handleClick = () => {
    this.props.historyPush({ pathname: CART_PATH });
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

export default connect(TabBarCartAction);
