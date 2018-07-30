import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common/constants/Portals';
import * as marketPortals from '@shopgate/pwa-common-commerce/market/constants/Portals';
import View from 'Components/View';
import ClientInformation from '@shopgate/pwa-ui-shared/ClientInformation';
import Headline from 'Components/Headline';
import List from 'Components/List';
import { PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import showReturnPolicy from '@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy';
import connect from './connector';
import UserMenu from './components/UserMenu';
import Header from './components/Header';

/* eslint-disable react/prefer-stateless-function */

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

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      entries,
      isLoggedIn,
    } = this.props;
    const showQuickLinks = entries.quicklinks && !!entries.quicklinks.length;

    const props = {
      Item: List.Item,
    };

    return (
      <View>
        <Header user={this.props.user} isLoggedIn={this.props.isLoggedIn} />
        { /* When not logged in, show user menu on top */ }
        { !isLoggedIn && <UserMenu {...this.props} /> }
        <Portal name={portals.NAV_MENU_CONTENT_BEFORE} props={props} />

        <Headline text="navigation.store_information" small />

        <List>

          {/* SHIPPING */}
          <Portal name={marketPortals.NAV_MENU_SHIPPING_BEFORE} props={props} />
          <Portal name={marketPortals.NAV_MENU_SHIPPING} props={props}>
            <List.Item title="navigation.shipping" link={`${PAGE_PATH}/shipping`} />
          </Portal>
          <Portal name={marketPortals.NAV_MENU_SHIPPING_AFTER} props={props} />

          {/* PAYMENT */}
          <Portal name={marketPortals.NAV_MENU_PAYMENT_BEFORE} props={props} />
          <Portal name={marketPortals.NAV_MENU_PAYMENT} props={props}>
            <List.Item title="navigation.payment" link={`${PAGE_PATH}/payment`} />
          </Portal>
          <Portal name={marketPortals.NAV_MENU_PAYMENT_AFTER} props={props} />

          {/* TERMS */}
          <Portal name={portals.NAV_MENU_TERMS_BEFORE} props={props} />
          <Portal name={portals.NAV_MENU_TERMS} props={props}>
            <List.Item title="navigation.terms" link={`${PAGE_PATH}/terms`} />
          </Portal>
          <Portal name={portals.NAV_MENU_TERMS_AFTER} props={props} />

          {/* PRIVACY POLICY */}
          <Portal name={portals.NAV_MENU_PRIVACY_BEFORE} props={props} />
          <Portal name={portals.NAV_MENU_PRIVACY} props={props}>
            <List.Item title="navigation.privacy" link={`${PAGE_PATH}/privacy`} />
          </Portal>
          <Portal name={portals.NAV_MENU_PRIVACY_AFTER} props={props} />

          {/* RETURN POLICY */}
          <Portal name={marketPortals.NAV_MENU_RETURN_POLICY_BEFORE} props={props} />
          {showReturnPolicy && (
            <Fragment>
              <Portal name={marketPortals.NAV_MENU_RETURN_POLICY} props={props}>
                <List.Item title="navigation.return_policy" link={`${PAGE_PATH}/return_policy`} />
              </Portal>
            </Fragment>
          )}
          <Portal name={marketPortals.NAV_MENU_RETURN_POLICY_AFTER} props={props} />

          {/* IMPRINT */}
          <Portal name={portals.NAV_MENU_IMPRINT_BEFORE} props={props} />
          <Portal name={portals.NAV_MENU_IMPRINT} props={props}>
            <List.Item title="navigation.about" link={`${PAGE_PATH}/imprint`} />
          </Portal>
          <Portal name={portals.NAV_MENU_IMPRINT_AFTER} props={props} />

        </List>

        {showQuickLinks && (
          <div>
            <Headline small text="navigation.more_menu" />
            <List>
              {entries.quicklinks.map(entry => (
                <List.Item key={entry.url} title={entry.label} link={entry.url} />
              ))}
            </List>
          </div>
        )}

        { /* When logged in, show user menu on the bottom */ }
        {isLoggedIn && <UserMenu {...this.props} />}

        <Portal name={portals.NAV_MENU_CONTENT_AFTER} props={props} />

        <ClientInformation />

      </View>
    );
  }
}

/* eslint-enable react/prefer-stateless-function */

export default connect(More);
