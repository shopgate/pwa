import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  NAV_MENU_CONTENT_BEFORE,
  NAV_MENU_CONTENT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import ClientInformation from '@shopgate/pwa-ui-shared/ClientInformation';
import { View } from '@shopgate/engage/components';
import { BackBar } from 'Components/AppBar/presets';
import Headline from 'Components/Headline';
import Quicklinks from './components/Quicklinks';
import StoreInfo from './components/StoreInfo';
import UserMenu from './components/UserMenu';
import portalProps from './portalProps';
import connect from './connector';
import styles from './style';

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
    logout: () => { },
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
    const { isLoggedIn } = this.props;

    return (
      <View aria-hidden={false}>
        <BackBar right={null} />
        <Headline style={styles.headline} tag="h1" text={this.welcomeMessage} />

        {!isLoggedIn && <UserMenu {...this.props} />}
        <Portal name={NAV_MENU_CONTENT_BEFORE} props={portalProps} />
        <Quicklinks />
        <StoreInfo />
        {isLoggedIn && <UserMenu {...this.props} />}
        <Portal name={NAV_MENU_CONTENT_AFTER} props={portalProps} />
        <ClientInformation />
      </View>
    );
  }
}

export default connect(More);
