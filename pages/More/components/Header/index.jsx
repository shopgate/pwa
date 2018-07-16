import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Headline from 'Components/Headline';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as commonPortals from '@shopgate/pwa-common/constants/Portals';
import List from 'Components/List';

/**
 * Header components. Renders main headline.
 * @property {Object} props Props.
 * @property {boolean} props.isLoggedIn Is user logged in.
 * @property {Object|null} props.user User data.
 * @returns {JSX}
 */
const Header = ({ isLoggedIn, user }) => (
  <Fragment>
    {/* Header */}
    <Portal
      name={commonPortals.NAV_MENU_HEADER_BEFORE}
      props={{
        Item: List.Item,
        user,
      }}
    />
    <Portal
      name={commonPortals.NAV_MENU_HEADER}
      props={{
        Item: List.Item,
        Headline,
        user,
      }}
    >
      <Headline>
        {
          isLoggedIn
          && <I18n.Text string="navigation.welcome_message" params={{ name: user.firstName }} />
        }
        { !isLoggedIn && <I18n.Text string="navigation.your_account" /> }
      </Headline>
    </Portal>
    <Portal
      name={commonPortals.NAV_MENU_HEADER_AFTER}
      props={{
        Item: List.Item,
        user,
      }}
    />
  </Fragment>
);

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.shape(),
};

Header.defaultProps = {
  user: null,
};

export default Header;
