import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as commonPortals from '@shopgate/pwa-common/constants/Portals';
import { UI_TOGGLE_NAVDRAWER } from '@shopgate/pwa-common/constants/ui';
import * as categoryPortals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import * as favoritesPortals from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import * as cartPortals from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import * as marketPortals from '@shopgate/pwa-common-commerce/market/constants/Portals';
import { INDEX_PATH, PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import showReturnPolicy from '@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy';
import appConfig from '@shopgate/pwa-common/helpers/config';
import ClientInformation from '@shopgate/pwa-ui-shared/ClientInformation';
import HomeIcon from '@shopgate/pwa-ui-shared/icons/HomeIcon';
import HeartIcon from '@shopgate/pwa-ui-shared/icons/HeartIcon';
import ViewListIcon from '@shopgate/pwa-ui-shared/icons/ViewListIcon';
import ShoppingCartIcon from '@shopgate/pwa-ui-shared/icons/ShoppingCartIcon';
import LocalShippingIcon from '@shopgate/pwa-ui-shared/icons/LocalShippingIcon';
import InfoIcon from '@shopgate/pwa-ui-shared/icons/InfoIcon';
import CreditCardIcon from '@shopgate/pwa-ui-shared/icons/CreditCardIcon';
import DescriptionIcon from '@shopgate/pwa-ui-shared/icons/DescriptionIcon';
import SecurityIcon from '@shopgate/pwa-ui-shared/icons/SecurityIcon';
import LogoutIcon from '@shopgate/pwa-ui-shared/icons/LogoutIcon';
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
    cartProductCount: PropTypes.number,
    entries: PropTypes.shape(),
    highlightFavorites: PropTypes.bool,
    logout: PropTypes.func,
    user: PropTypes.shape(),
  };

  static defaultProps = {
    cartProductCount: 0,
    entries: {},
    highlightFavorites: false,
    logout: () => {},
    user: null,
  };

  /**
   * The constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.contentRef = null;

    this.state = {
      open: false,
    };

    UIEvents.addListener(UI_TOGGLE_NAVDRAWER, this.toggleDrawer);
  }

  /**
   * Sets a ref to the content element in order to reset scroll position.
   * @param {HTMLElement} ref The element ref.
   */
  setContentRef = (ref) => {
    this.contentRef = ref;
  };

  /**
   * @param {boolean} open The new state of the drawer.
   */
  toggleDrawer = (open) => {
    if (this.state.open === open) {
      return;
    }

    this.setState({ open });

    if (!open) {
      this.contentRef.scrollTop = 0;
    }
  }

  /**
   * Handles the close event for the drawer and propagates the changes to the store.
   */
  handleClose = () => {
    UIEvents.emit(UI_TOGGLE_NAVDRAWER, false);
  };

  /**
   * Renders Items for the given menu entries.
   * @param {Array} entries The menu entries.
   * @returns {JSX}
   */
  renderEntries(entries) {
    return entries.map(entry => (
      <Item
        href={INDEX_PATH}
        icon={HomeIcon}
        key={entry.url}
        label={entry.label}
        close={this.handleClose}
      />
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
      logout,
    } = this.props;

    const showQuickLinks = entries.quicklinks && !!entries.quicklinks.length;

    const props = {
      handleClose: this.handleClose,
      Item,
    };

    return (
      <Layout
        active={this.state.open}
        close={this.handleClose}
        setContentRef={this.setContentRef}
      >

        {/* Header */}
        <Portal
          name={commonPortals.USER_MENU_CONTAINER_BEFORE}
          props={{
            ...props,
            user,
          }}
        />
        <Portal
          name={commonPortals.USER_MENU_CONTAINER}
          props={{
            ...props,
            user,
          }}
        >
          <Header user={user} close={this.handleClose} />
        </Portal>
        <Portal
          name={commonPortals.USER_MENU_CONTAINER_AFTER}
          props={{
            ...props,
            user,
          }}
        />

        <Portal name={commonPortals.NAV_MENU_CONTENT_BEFORE} props={props} />

        {/* Home */}
        <Portal name={commonPortals.NAV_MENU_HOME_BEFORE} props={props} />
        <Portal name={commonPortals.NAV_MENU_HOME} props={props}>
          <Item
            href={INDEX_PATH}
            icon={HomeIcon}
            label="navigation.home"
            close={this.handleClose}
            testId="NavDrawerStartPage"
          />
        </Portal>
        <Portal name={commonPortals.NAV_MENU_HOME_AFTER} props={props} />

        {/* Categories */}
        <Portal name={categoryPortals.NAV_MENU_CATEGORIES_BEFORE} props={props} />
        <Portal name={categoryPortals.NAV_MENU_CATEGORIES} props={props}>
          <Item
            href={CATEGORY_PATH}
            icon={ViewListIcon}
            label="navigation.categories"
            close={this.handleClose}
          />
        </Portal>
        <Portal name={categoryPortals.NAV_MENU_CATEGORIES_AFTER} props={props} />

        {/* Favorites */}
        <Portal name={favoritesPortals.NAV_MENU_FAVORITES_BEFORE} props={props} />
        {appConfig.hasFavorites && (
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
              label="navigation.favorites"
              withIndicator={this.props.highlightFavorites}
            />
          </Portal>
        )}
        <Portal name={favoritesPortals.NAV_MENU_FAVORITES_AFTER} props={props} />

        {/* Cart */}
        <Portal
          name={cartPortals.NAV_MENU_CART_BEFORE}
          props={{
            ...props,
            productCount: cartProductCount,
          }}
        />
        <Portal
          name={cartPortals.NAV_MENU_CART}
          props={{
            ...props,
            productCount: cartProductCount,
          }}
        >
          <CartItem
            close={this.handleClose}
            count={cartProductCount}
            href={CART_PATH}
            icon={ShoppingCartIcon}
            label="navigation.cart"
          />
        </Portal>
        <Portal
          name={cartPortals.NAV_MENU_CART_AFTER}
          props={{
            ...props,
            productCount: cartProductCount,
          }}
        />

        <Divider close={this.handleClose} />

        {showQuickLinks && this.renderEntries(entries.quicklinks)}
        {showQuickLinks && <Divider close={this.handleClose} />}

        {/* Shipping */}
        <Portal name={marketPortals.NAV_MENU_SHIPPING_BEFORE} props={props} />
        <Portal name={marketPortals.NAV_MENU_SHIPPING} props={props}>
          <Item
            href={`${PAGE_PATH}/shipping`}
            icon={LocalShippingIcon}
            close={this.handleClose}
            label="navigation.shipping"
          />
        </Portal>
        <Portal name={marketPortals.NAV_MENU_SHIPPING_AFTER} props={props} />

        {/* Payment */}
        <Portal name={marketPortals.NAV_MENU_PAYMENT_BEFORE} props={props} />
        <Portal name={marketPortals.NAV_MENU_PAYMENT} props={props}>
          <Item
            href={`${PAGE_PATH}/payment`}
            icon={CreditCardIcon}
            close={this.handleClose}
            label="navigation.payment"
          />
        </Portal>
        <Portal name={marketPortals.NAV_MENU_PAYMENT_AFTER} props={props} />

        <Divider close={this.handleClose} />

        {/* Terms */}
        <Portal name={commonPortals.NAV_MENU_TERMS_BEFORE} props={props} />
        <Portal name={commonPortals.NAV_MENU_TERMS} props={props}>
          <Item
            href={`${PAGE_PATH}/terms`}
            icon={DescriptionIcon}
            close={this.handleClose}
            label="navigation.terms"
          />
        </Portal>
        <Portal name={commonPortals.NAV_MENU_TERMS_AFTER} props={props} />

        {/* Privacy */}
        <Portal name={commonPortals.NAV_MENU_PRIVACY_BEFORE} props={props} />
        <Portal name={commonPortals.NAV_MENU_PRIVACY} props={props}>
          <Item
            href={`${PAGE_PATH}/privacy`}
            icon={SecurityIcon}
            close={this.handleClose}
            label="navigation.privacy"
          />
        </Portal>
        <Portal name={commonPortals.NAV_MENU_PRIVACY_AFTER} props={props} />

        {/* Return Policy */}
        <Portal name={marketPortals.NAV_MENU_RETURN_POLICY_BEFORE} props={props} />
        {showReturnPolicy && (
          <Portal name={marketPortals.NAV_MENU_RETURN_POLICY} props={props}>
            <Item
              href={`${PAGE_PATH}/return_policy`}
              icon={DescriptionIcon}
              close={this.handleClose}
              label="navigation.return_policy"
            />
          </Portal>
        )}
        <Portal name={marketPortals.NAV_MENU_RETURN_POLICY_AFTER} props={props} />

        {/* Imprint */}
        <Portal name={commonPortals.NAV_MENU_IMPRINT_BEFORE} props={props} />
        <Portal name={commonPortals.NAV_MENU_IMPRINT} props={props}>
          <Item
            href={`${PAGE_PATH}/imprint`}
            icon={InfoIcon}
            close={this.handleClose}
            label="navigation.about"
          />
        </Portal>
        <Portal name={commonPortals.NAV_MENU_IMPRINT_AFTER} props={props} />

        {user && <Divider close={this.handleClose} />}

        <Portal name={commonPortals.NAV_MENU_LOGOUT_BEFORE} props={props} />
        <Portal
          name={commonPortals.NAV_MENU_LOGOUT}
          props={{
            ...props,
            handleLogout: logout,
          }}
        >
          {user && (
            <Item
              onClick={logout}
              icon={LogoutIcon}
              close={this.handleClose}
              label="navigation.logout"
              testId="logoutButtonNavDrawer"
            />
          )}
        </Portal>
        <Portal name={commonPortals.NAV_MENU_LOGOUT_AFTER} props={props} />

        <Portal name={commonPortals.NAV_MENU_CONTENT_AFTER} props={props} />

        <ClientInformation />

      </Layout>
    );
  }
}

export default connect(NavDrawer);

export { NavDrawer as Unwrapped };
