import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common/constants/Portals';
import { PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import * as marketPortals from '@shopgate/pwa-common-commerce/market/constants/Portals';
import showReturnPolicy from '@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy';
import ClientInformation from '@shopgate/pwa-ui-shared/ClientInformation';
import View from 'Components/View';
import { BackBar } from 'Components/AppBar/presets';
import Headline from 'Components/Headline';
import connect from './connector';
import UserMenu from './components/UserMenu';
import Item from './components/Item';
import Quicklinks from './components/Quicklinks';
import styles from './style';

const portalProps = {
  Headline,
  Item,
};

/**
 * The More component.
 */
class More extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    logout: PropTypes.func,
    user: PropTypes.shape(),
  };

  static defaultProps = {
    isLoggedIn: false,
    logout: () => {},
    user: null,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * @returns {string}
   */
  get welcomeMessage() {
    const { isLoggedIn, user } = this.props;
    const { __ } = this.context.i18n();

    if (isLoggedIn) {
      return __('navigation.welcome_message', { name: user.firstName });
    }

    return __('login.headline');
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { __ } = this.context.i18n();
    const { isLoggedIn } = this.props;

    return (
      <View>
        <BackBar right={null} />
        <Headline style={styles.headline} tag="h1" text={this.welcomeMessage} />
        {!isLoggedIn && <UserMenu {...this.props} />}

        <Portal name={portals.NAV_MENU_CONTENT_BEFORE} props={portalProps} />

        <Quicklinks />

        <Portal name={portals.NAV_MENU_STORE_INFORMATION_BEFORE} props={portalProps} />
        <Portal name={portals.NAV_MENU_STORE_INFORMATION} props={portalProps}>
          <Headline style={styles.headline} text={__('navigation.store_information')} />

          <nav className={styles.list}>
            {/* SHIPPING */}
            <Portal name={marketPortals.NAV_MENU_SHIPPING_BEFORE} props={portalProps} />
            <Portal name={marketPortals.NAV_MENU_SHIPPING} props={portalProps}>
              <Item href={`${PAGE_PATH}/shipping`} label="navigation.shipping" />
            </Portal>
            <Portal name={marketPortals.NAV_MENU_SHIPPING_AFTER} props={portalProps} />

            {/* PAYMENT */}
            <Portal name={marketPortals.NAV_MENU_PAYMENT_BEFORE} props={portalProps} />
            <Portal name={marketPortals.NAV_MENU_PAYMENT} props={portalProps}>
              <Item href={`${PAGE_PATH}/payment`} label="navigation.payment" />
            </Portal>
            <Portal name={marketPortals.NAV_MENU_PAYMENT_AFTER} props={portalProps} />

            {/* TERMS */}
            <Portal name={portals.NAV_MENU_TERMS_BEFORE} props={portalProps} />
            <Portal name={portals.NAV_MENU_TERMS} props={portalProps}>
              <Item href={`${PAGE_PATH}/terms`} label="navigation.terms" />
            </Portal>
            <Portal name={portals.NAV_MENU_TERMS_AFTER} props={portalProps} />

            {/* PRIVACY POLICY */}
            <Portal name={portals.NAV_MENU_PRIVACY_BEFORE} props={portalProps} />
            <Portal name={portals.NAV_MENU_PRIVACY} props={portalProps}>
              <Item href={`${PAGE_PATH}/privacy`} label="navigation.privacy" />
            </Portal>
            <Portal name={portals.NAV_MENU_PRIVACY_AFTER} props={portalProps} />

            {/* RETURN POLICY */}
            <Portal name={marketPortals.NAV_MENU_RETURN_POLICY_BEFORE} props={portalProps} />
            {showReturnPolicy && (
              <Fragment>
                <Portal name={marketPortals.NAV_MENU_RETURN_POLICY} props={portalProps}>
                  <Item href={`${PAGE_PATH}/return_policy`} label="navigation.return_policy" />
                </Portal>
              </Fragment>
            )}
            <Portal name={marketPortals.NAV_MENU_RETURN_POLICY_AFTER} props={portalProps} />

            {/* IMPRINT */}
            <Portal name={portals.NAV_MENU_IMPRINT_BEFORE} props={portalProps} />
            <Portal name={portals.NAV_MENU_IMPRINT} props={portalProps}>
              <Item href={`${PAGE_PATH}/imprint`} label="navigation.about" />
            </Portal>
            <Portal name={portals.NAV_MENU_IMPRINT_AFTER} props={portalProps} />
          </nav>
        </Portal>
        <Portal name={portals.NAV_MENU_STORE_INFORMATION_AFTER} props={portalProps} />

        {isLoggedIn && <UserMenu {...this.props} />}

        <Portal name={portals.NAV_MENU_CONTENT_AFTER} props={portalProps} />
        <ClientInformation />
      </View>
    );
  }
}

export default connect(More);
