import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  NAV_MENU_CONTENT_BEFORE,
  NAV_MENU_CONTENT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { ClientInformation } from '@shopgate/engage/development/components';
import { View } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { BackBar } from 'Components/AppBar/presets';
import Headline from 'Components/Headline';
import Quicklinks from './components/Quicklinks';
import StoreInfo from './components/StoreInfo';
import UserMenu from './components/UserMenu';
import portalProps from './portalProps';
import connect from './connector';

const headline = {
  margin: '24px 20px 16px',
};

/**
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const More = (props) => {
  const { isLoggedIn, user } = props;

  const welcomeMessage = useMemo(() => {
    if (isLoggedIn && user) {
      return i18n.text('navigation.welcome_message', { name: user.firstName });
    }
    return i18n.text('login.headline');
  }, [isLoggedIn, user]);

  return (
    <View aria-hidden={false}>
      <BackBar right={null} />
      <Headline style={headline} tag="h1" text={welcomeMessage} />
      {!isLoggedIn && <UserMenu {...props} />}
      <Portal name={NAV_MENU_CONTENT_BEFORE} props={portalProps} />
      {isLoggedIn && <UserMenu {...props} />}
      <Quicklinks />
      <StoreInfo />
      <Portal name={NAV_MENU_CONTENT_AFTER} props={portalProps} />
      <ClientInformation />
    </View>
  );
};

More.propTypes = {
  isLoggedIn: PropTypes.bool,
  logout: PropTypes.func,
  user: PropTypes.shape(),
};

More.defaultProps = {
  isLoggedIn: false,
  logout: () => { },
  user: null,
};

export default connect(More);
