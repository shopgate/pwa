/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common/constants/Portals';
import View from 'Components/View';
import ClientInformation from 'Components/ClientInformation';
import Headline from 'Components/Headline';
import List from 'Components/List';
import { PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import showReturnPolicy from '@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy';
import connect from './connector';
import UserMenu from './components/UserMenu/index';

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
      logout,
      user,
    } = this.props;
    const showQuickLinks = entries.quicklinks && !!entries.quicklinks.length;

    const props = {
      Item: List.Item,
    };

    return (
      <View>
        <UserMenu isLoggedIn={isLoggedIn} logout={logout} user={user} />

        <Portal name={portals.NAV_MENU_CONTENT_BEFORE} />

        <Headline text="navigation.store_information" small />

        <List>

          {/* SHIPPING */}
          <Portal name={portals.NAV_MENU_SHIPPING_BEFORE} />
          <Portal name={portals.NAV_MENU_SHIPPING} props={props}>
            <List.Item title="navigation.shipping" link={`${PAGE_PATH}/shipping`} />
          </Portal>
          <Portal name={portals.NAV_MENU_SHIPPING_AFTER} />

          {/* PAYMENT */}
          <Portal name={portals.NAV_MENU_PAYMENT_BEFORE} />
          <Portal name={portals.NAV_MENU_PAYMENT} props={props}>
            <List.Item title="navigation.payment" link={`${PAGE_PATH}/payment`} />
          </Portal>
          <Portal name={portals.NAV_MENU_PAYMENT_AFTER} />

          {/* TERMS */}
          <Portal name={portals.NAV_MENU_TERTMS_BEFORE} />
          <Portal name={portals.NAV_MENU_TERTMS} props={props}>
            <List.Item title="navigation.terms" link={`${PAGE_PATH}/terms`} />
          </Portal>
          <Portal name={portals.NAV_MENU_TERTMS_AFTER} />

          {/* PRIVACY POLICY */}
          <Portal name={portals.NAV_MENU_PRIVACY_BEFORE} />
          <Portal name={portals.NAV_MENU_PRIVACY} props={props}>
            <List.Item title="navigation.privacy" link={`${PAGE_PATH}/privacy`} />
          </Portal>
          <Portal name={portals.NAV_MENU_PRIVACY_AFTER} />

          {/* RETURN POLICY */}
          {showReturnPolicy && (
            <Fragment>
              <Portal name={portals.NAV_MENU_RETURN_POLICY_BEFORE} />
              <Portal name={portals.NAV_MENU_RETURN_POLICY} props={props}>
                <List.Item title="navigation.return_policy" link={`${PAGE_PATH}/return_policy`} />
              </Portal>
              <Portal name={portals.NAV_MENU_RETURN_POLICY_AFTER} />
            </Fragment>
          )}

          {/* IMPRINT */}
          <Portal name={portals.NAV_MENU_IMPRINT_BEFORE} />
          <Portal name={portals.NAV_MENU_IMPRINT} props={props}>
            <List.Item title="navigation.contact" link={`${PAGE_PATH}/imprint`} />
          </Portal>
          <Portal name={portals.NAV_MENU_IMPRINT_AFTER} />

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

        <Portal name={portals.NAV_MENU_CONTENT_AFTER} />

        <ClientInformation />

      </View>
    );
  }
}

/* eslint-enable react/prefer-stateless-function */

export default connect(More);
