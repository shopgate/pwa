import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common/constants/Portals';
import * as marketPortals from '@shopgate/pwa-common-commerce/market/constants/Portals';
import View from 'Components/View';
import { BackBar } from 'Components/AppBar/presets';
import Headline from 'Components/Headline';
import { PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import showReturnPolicy from '@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy';
import connect from './connector';
import UserMenu from './components/UserMenu';
import Header from './components/Header';
import Item from './components/Item';
import styles from './style';

/**
 * The More component.
 */
class More extends Component {
  static propTypes = {
    entries: PropTypes.shape(),
    isLoggedIn: PropTypes.bool,
    logout: PropTypes.func,
    user: PropTypes.shape(),
  };

  static defaultProps = {
    entries: null,
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
    const {
      entries,
      isLoggedIn,
    } = this.props;
    const showQuickLinks = entries.quicklinks && !!entries.quicklinks.length;

    const props = {
      Headline,
      Item,
    };

    return (
      <View>
        <BackBar right={null} />
        <Headline style={styles.headline} tag="h1" text={this.welcomeMessage} />
        <Header user={this.props.user} isLoggedIn={isLoggedIn} />
        <UserMenu {...this.props} />
        <Portal name={portals.NAV_MENU_CONTENT_BEFORE} props={props} />

        {showQuickLinks && (
          <Fragment>
            <Headline style={styles.headline} text={__('navigation.more_menu')} />
            <nav className={styles.list}>
              {entries.quicklinks.map(entry => (
                <Item href={entry.url} key={entry.url}>
                  {entry.label}
                </Item>
              ))}
            </nav>
          </Fragment>
        )}

        <Portal name={portals.NAV_MENU_STORE_INFORMATION_BEFORE} props={props} />
        <Portal name={portals.NAV_MENU_STORE_INFORMATION} props={props}>
          <Headline style={styles.headline} text={__('navigation.store_information')} />

          <nav className={styles.list}>
            {/* SHIPPING */}
            <Portal name={marketPortals.NAV_MENU_SHIPPING_BEFORE} props={props} />
            <Portal name={marketPortals.NAV_MENU_SHIPPING} props={props}>
              <Item href={`${PAGE_PATH}/shipping`}>
                {__('navigation.shipping')}
              </Item>
            </Portal>
            <Portal name={marketPortals.NAV_MENU_SHIPPING_AFTER} props={props} />

            {/* PAYMENT */}
            <Portal name={marketPortals.NAV_MENU_PAYMENT_BEFORE} props={props} />
            <Portal name={marketPortals.NAV_MENU_PAYMENT} props={props}>
              <Item href={`${PAGE_PATH}/payment`}>
                {__('navigation.payment')}
              </Item>
            </Portal>
            <Portal name={marketPortals.NAV_MENU_PAYMENT_AFTER} props={props} />

            {/* TERMS */}
            <Portal name={portals.NAV_MENU_TERMS_BEFORE} props={props} />
            <Portal name={portals.NAV_MENU_TERMS} props={props}>
              <Item href={`${PAGE_PATH}/navigation_terms`}>
                {__('navigation.terms')}
              </Item>
            </Portal>
            <Portal name={portals.NAV_MENU_TERMS_AFTER} props={props} />

            {/* PRIVACY POLICY */}
            <Portal name={portals.NAV_MENU_PRIVACY_BEFORE} props={props} />
            <Portal name={portals.NAV_MENU_PRIVACY} props={props}>
              <Item href={`${PAGE_PATH}/privacy`}>
                {__('navigation.privacy')}
              </Item>
            </Portal>
            <Portal name={portals.NAV_MENU_PRIVACY_AFTER} props={props} />

            {/* RETURN POLICY */}
            <Portal name={marketPortals.NAV_MENU_RETURN_POLICY_BEFORE} props={props} />
            {showReturnPolicy && (
              <Fragment>
                <Portal name={marketPortals.NAV_MENU_RETURN_POLICY} props={props}>
                  <Item href={`${PAGE_PATH}/return_policy`}>
                    {__('navigation.return_policy')}
                  </Item>
                </Portal>
              </Fragment>
            )}
            <Portal name={marketPortals.NAV_MENU_RETURN_POLICY_AFTER} props={props} />

            {/* IMPRINT */}
            <Portal name={portals.NAV_MENU_IMPRINT_BEFORE} props={props} />
            <Portal name={portals.NAV_MENU_IMPRINT} props={props}>
              <Item href={`${PAGE_PATH}/imprint`}>
                {__('navigation.about')}
              </Item>
            </Portal>
            <Portal name={portals.NAV_MENU_IMPRINT_AFTER} props={props} />
          </nav>
        </Portal>
        <Portal name={portals.NAV_MENU_STORE_INFORMATION_AFTER} props={props} />
        <Portal name={portals.NAV_MENU_CONTENT_AFTER} props={props} />
      </View>
    );
  }
}

export default connect(More);
