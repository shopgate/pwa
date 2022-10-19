import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NAV_MENU_CONTENT } from '@shopgate/pwa-common/constants/Portals';
import ClientInformation from '@shopgate/pwa-ui-shared/ClientInformation';
import { SurroundPortals, View } from '@shopgate/engage/components';
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

        {isLoggedIn ? <UserMenu {...this.props} /> : null}
        <SurroundPortals portalName={NAV_MENU_CONTENT} portalProps={portalProps}>
          <Quicklinks />
          <StoreInfo />
        </SurroundPortals>
        <ClientInformation />
      </View>
    );
  }
}

export default connect(More);
