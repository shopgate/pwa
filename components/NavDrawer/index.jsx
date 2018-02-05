/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { INDEX_PATH, PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { ORDERS_PATH } from '@shopgate/pwa-common-commerce/orders/constants';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import appConfig from '@shopgate/pwa-common/helpers/config';
import ClientInformation from 'Components/ClientInformation';
import HomeIcon from 'Components/icons/HomeIcon';
import HeartIcon from 'Components/icons/HeartIcon';
import ViewListIcon from 'Components/icons/ViewListIcon';
import ShoppingCartIcon from 'Components/icons/ShoppingCartIcon';
import BoxIcon from 'Components/icons/BoxIcon';
import LocalShippingIcon from 'Components/icons/LocalShippingIcon';
import InfoIcon from 'Components/icons/InfoIcon';
import CreditCardIcon from 'Components/icons/CreditCardIcon';
import DescriptionIcon from 'Components/icons/DescriptionIcon';
import SecurityIcon from 'Components/icons/SecurityIcon';
import LogoutIcon from 'Components/icons/LogoutIcon';
import Layout from './components/Layout';
import Item from './components/Item';
import CartItem from './components/CartItem';
import Divider from './components/Divider';
import Header from './components/Header';
import connect from './connector';

/**
 * The NavDrawer component.
 */
class NavDrawer extends Component {
  static propTypes = {
    toggleNavDrawer: PropTypes.func.isRequired,
    cartProductCount: PropTypes.number,
    entries: PropTypes.shape(),
    highlightFavorites: PropTypes.bool,
    logout: PropTypes.func,
    navDrawerActive: PropTypes.bool,
    user: PropTypes.shape(),
  };

  static defaultProps = {
    cartProductCount: 0,
    entries: {},
    highlightFavorites: false,
    logout: () => {},
    navDrawerActive: false,
    user: null,
  };

  /**
   * The constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.contentRef = null;
  }

  /**
   * Reset scroll position when drawer opens.
   */
  componentWillReceiveProps({ navDrawerActive }) {
    if (this.contentRef && navDrawerActive && !this.props.navDrawerActive) {
      this.contentRef.scrollTop = 0;
    }
  }

  /**
   * Sets a ref to the content element in order to reset scroll position.
   * @param {HTMLElement} ref The element ref.
   */
  setContentRef = (ref) => {
    this.contentRef = ref;
  };

  /**
   * Handles the close event for the drawer and propagates the changes to the store.
   */
  handleClose = () => {
    this.props.toggleNavDrawer(false);
  };

  /**
   * Renders Items for the given menu entries.
   * @param {Array} entries The menu entries.
   * @returns {JSX}
   */
  renderEntries(entries) {
    return entries.map(entry => (
      <Item key={entry.url} href={entry.url} close={this.handleClose}>
        <I18n.Text string={entry.label} />
      </Item>
    ));
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      entries,
      user,
      cartProductCount,
      navDrawerActive,
      logout,
    } = this.props;

    const showQuickLinks = entries.quicklinks && !!entries.quicklinks.length;

    return (
      <Layout
        active={navDrawerActive}
        close={this.handleClose}
        setContentRef={this.setContentRef}
      >

        <Header user={user} close={this.handleClose} />

        <Item href={INDEX_PATH} icon={HomeIcon} close={this.handleClose}>
          <I18n.Text string="navigation.home" />
        </Item>

        <Item href={CATEGORY_PATH} icon={ViewListIcon} close={this.handleClose}>
          <I18n.Text string="navigation.categories" />
        </Item>

        { appConfig.hasFavorites &&
          <Item
            href={FAVORITES_PATH}
            icon={HeartIcon}
            close={this.handleClose}
            withIndicator={this.props.highlightFavorites}
          >
            <I18n.Text string="navigation.favorites" />
          </Item>
        }

        <CartItem
          href={CART_PATH}
          icon={ShoppingCartIcon}
          count={cartProductCount}
          close={this.handleClose}
        >
          <I18n.Text string="navigation.cart" />
        </CartItem>

        <Divider close={this.handleClose} />

        {showQuickLinks && this.renderEntries(entries.quicklinks)}
        {showQuickLinks && <Divider close={this.handleClose} />}

        {user && (
          <Item href={ORDERS_PATH} icon={BoxIcon} close={this.handleClose}>
            <I18n.Text string="navigation.my_orders" />
          </Item>
        )}

        <Item href={`${PAGE_PATH}/shipping`} icon={LocalShippingIcon} close={this.handleClose}>
          <I18n.Text string="navigation.shipping" />
        </Item>

        <Item href={`${PAGE_PATH}/payment`} icon={CreditCardIcon} close={this.handleClose}>
          <I18n.Text string="navigation.payment" />
        </Item>

        <Divider close={this.handleClose} />

        <Item href={`${PAGE_PATH}/terms`} icon={DescriptionIcon} close={this.handleClose}>
          <I18n.Text string="navigation.terms" />
        </Item>

        <Item href={`${PAGE_PATH}/privacy`} icon={SecurityIcon} close={this.handleClose}>
          <I18n.Text string="navigation.privacy" />
        </Item>

        <Item href={`${PAGE_PATH}/imprint`} icon={InfoIcon} close={this.handleClose}>
          <I18n.Text string="navigation.about" />
        </Item>

        {user && <Divider close={this.handleClose} />}
        {user && (
          <Item onClick={logout} icon={LogoutIcon} close={this.handleClose}>
            <I18n.Text string="navigation.logout" />
          </Item>
        )}

        <ClientInformation />

      </Layout>
    );
  }
}

export default connect(NavDrawer);

export { NavDrawer as Unwrapped };
