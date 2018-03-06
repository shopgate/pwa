/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as commonPortals from '@shopgate/pwa-common/constants/Portals';
import * as categoryPortals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import * as favoritesPortals from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import * as cartPortals from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { INDEX_PATH, PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import showReturnPolicy from '@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy';
import appConfig from '@shopgate/pwa-common/helpers/config';
import ClientInformation from 'Components/ClientInformation';
import HomeIcon from 'Components/icons/HomeIcon';
import HeartIcon from 'Components/icons/HeartIcon';
import ViewListIcon from 'Components/icons/ViewListIcon';
import ShoppingCartIcon from 'Components/icons/ShoppingCartIcon';
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

    const props = {
      handleClose: this.handleClose,
      Item,
    };

    return (
      <Layout
        active={navDrawerActive}
        close={this.handleClose}
        setContentRef={this.setContentRef}
      >

        {/* Header */}
        <Portal name={commonPortals.NAV_MENU_HEADER_BEFORE} />
        <Portal
          name={commonPortals.NAV_MENU_HEADER}
          props={{
            ...props,
            user,
          }}
        >
          <Header user={user} close={this.handleClose} />
        </Portal>
        <Portal name={commonPortals.NAV_MENU_HEADER_AFTER} />

        <Portal name={commonPortals.NAV_MENU_CONTENT_BEFORE} />

        {/* Home */}
        <Portal name={commonPortals.NAV_MENU_HOME_BEFORE} />
        <Portal name={commonPortals.NAV_MENU_HOME} props={props}>
          <Item href={INDEX_PATH} icon={HomeIcon} close={this.handleClose}>
            <I18n.Text string="navigation.home" />
          </Item>
        </Portal>
        <Portal name={commonPortals.NAV_MENU_HOME_AFTER} />

        {/* Categories */}
        <Portal name={categoryPortals.NAV_MENU_CATEGORIES_BEFORE} />
        <Portal name={categoryPortals.NAV_MENU_CATEGORIES} props={props}>
          <Item href={CATEGORY_PATH} icon={ViewListIcon} close={this.handleClose}>
            <I18n.Text string="navigation.categories" />
          </Item>
        </Portal>
        <Portal name={categoryPortals.NAV_MENU_CATEGORIES_AFTER} />

        <Portal name={favoritesPortals.NAV_MENU_FAVORITES_BEFORE} />
        {appConfig.hasFavorites && (
          <Fragment>
            <Portal
              name={favoritesPortals.NAV_MENU_FAVORITES}
              props={{
                ...props,
                withIndicator: this.props.highlightFavorites,
              }}
            >
              <Item
                href={FAVORITES_PATH}
                icon={HeartIcon}
                close={this.handleClose}
                withIndicator={this.props.highlightFavorites}
              >
                <I18n.Text string="navigation.favorites" />
              </Item>
            </Portal>
          </Fragment>
        )}
        <Portal name={favoritesPortals.NAV_MENU_FAVORITES_AFTER} />

        <Portal name={cartPortals.NAV_MENU_CART_BEFORE} />
        <Portal
          name={cartPortals.NAV_MENU_CART}
          props={{
            ...props,
            productCount: cartProductCount,
          }}
        >
          <CartItem
            href={CART_PATH}
            icon={ShoppingCartIcon}
            count={cartProductCount}
            close={this.handleClose}
          >
            <I18n.Text string="navigation.cart" />
          </CartItem>
        </Portal>
        <Portal name={cartPortals.NAV_MENU_CART_AFTER} />

        <Divider close={this.handleClose} />

        {showQuickLinks && this.renderEntries(entries.quicklinks)}
        {showQuickLinks && <Divider close={this.handleClose} />}

        <Portal name={commonPortals.NAV_MENU_SHIPPING_BEFORE} />
        <Portal name={commonPortals.NAV_MENU_SHIPPING} props={props}>
          <Item href={`${PAGE_PATH}/shipping`} icon={LocalShippingIcon} close={this.handleClose}>
            <I18n.Text string="navigation.shipping" />
          </Item>
        </Portal>
        <Portal name={commonPortals.NAV_MENU_SHIPPING_AFTER} />

        <Portal name={commonPortals.NAV_MENU_PAYMENT_BEFORE} />
        <Portal name={commonPortals.NAV_MENU_PAYMENT} props={props}>
          <Item href={`${PAGE_PATH}/payment`} icon={CreditCardIcon} close={this.handleClose}>
            <I18n.Text string="navigation.payment" />
          </Item>
        </Portal>
        <Portal name={commonPortals.NAV_MENU_PAYMENT_AFTER} />

        <Divider close={this.handleClose} />

        <Portal name={commonPortals.NAV_MENU_TERTMS_BEFORE} />
        <Portal name={commonPortals.NAV_MENU_TERTMS} props={props}>
          <Item href={`${PAGE_PATH}/terms`} icon={DescriptionIcon} close={this.handleClose}>
            <I18n.Text string="navigation.terms" />
          </Item>
        </Portal>
        <Portal name={commonPortals.NAV_MENU_TERTMS_AFTER} />

        <Portal name={commonPortals.NAV_MENU_PRIVACY_BEFORE} />
        <Portal name={commonPortals.NAV_MENU_PRIVACY} props={props}>
          <Item href={`${PAGE_PATH}/privacy`} icon={SecurityIcon} close={this.handleClose}>
            <I18n.Text string="navigation.privacy" />
          </Item>
        </Portal>
        <Portal name={commonPortals.NAV_MENU_PRIVACY_AFTER} />

        <Portal name={commonPortals.NAV_MENU_RETURN_POLICY_BEFORE} />
        {showReturnPolicy && (
          <Fragment>
            <Portal name={commonPortals.NAV_MENU_RETURN_POLICY} props={props}>
              <Item href={`${PAGE_PATH}/return_policy`} icon={DescriptionIcon} close={this.handleClose}>
                <I18n.Text string="navigation.return_policy" />
              </Item>
            </Portal>
          </Fragment>
        )}
        <Portal name={commonPortals.NAV_MENU_RETURN_POLICY_AFTER} />

        <Portal name={commonPortals.NAV_MENU_IMPRINT_BEFORE} />
        <Portal name={commonPortals.NAV_MENU_IMPRINT} props={props}>
          <Item href={`${PAGE_PATH}/imprint`} icon={InfoIcon} close={this.handleClose}>
            <I18n.Text string="navigation.about" />
          </Item>
        </Portal>
        <Portal name={commonPortals.NAV_MENU_IMPRINT_AFTER} />

        {user && <Divider close={this.handleClose} />}
        {user && (
          <Fragment>
            <Portal name={commonPortals.NAV_MENU_LOGOUT_BEFORE} />
            <Portal
              name={commonPortals.NAV_MENU_LOGOUT}
              props={{
                ...props,
                handleLogout: logout,
              }}
            >
              <Item onClick={logout} icon={LogoutIcon} close={this.handleClose}>
                <I18n.Text string="navigation.logout" />
              </Item>
            </Portal>
            <Portal name={commonPortals.NAV_MENU_LOGOUT_AFTER} />
          </Fragment>
        )}

        <Portal name={commonPortals.NAV_MENU_CONTENT_AFTER} />

        <ClientInformation />

      </Layout>
    );
  }
}

export default connect(NavDrawer);

export { NavDrawer as Unwrapped };
