import React, { Component } from 'react';
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

    return (
      <View>
        <UserMenu isLoggedIn={isLoggedIn} logout={logout} user={user} />

        <Portal name={portals.NAV_MENU_CONTENT_BEFORE} />
        <Headline text="navigation.store_information" small />
        <List>
          <List.Item title="navigation.shipping" link={`${PAGE_PATH}/shipping`} />
          <List.Item title="navigation.payment" link={`${PAGE_PATH}/payment`} />
          <List.Item title="navigation.terms" link={`${PAGE_PATH}/terms`} />
          <List.Item title="navigation.privacy" link={`${PAGE_PATH}/privacy`} />
          {showReturnPolicy && <List.Item title="navigation.return_policy" link={`${PAGE_PATH}/return_policy`} />}
          <List.Item title="navigation.contact" link={`${PAGE_PATH}/imprint`} />
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
