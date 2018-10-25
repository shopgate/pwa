import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as commonPortals from '@shopgate/pwa-common/constants/Portals';
import List from 'Components/List';
import Item from '../../../Item';
import pageStyles from '../../../../style';

/**
 * @param {Object} props The component props.
 * @param {Object} context The consumed context.
 * @returns {JSX}
 */
const LoggedIn = ({ logout }, context) => {
  const { __ } = context.i18n();
  const props = { Item: List.Item };
  return (
    <Fragment>
      <Portal name={commonPortals.NAV_MENU_MY_ACCOUNT_BEFORE} props={props} />
      <Portal name={commonPortals.NAV_MENU_MY_ACCOUNT} props={props}>
        <Portal name={commonPortals.NAV_MENU_LOGOUT_BEFORE} props={props} />
        <Portal name={commonPortals.NAV_MENU_LOGOUT} props={props}>
          <nav className={pageStyles.list}>
            <Item onClick={logout}>
              {__('navigation.logout')}
            </Item>
          </nav>
        </Portal>
        <Portal name={commonPortals.NAV_MENU_LOGOUT_AFTER} props={props} />
      </Portal>
      <Portal name={commonPortals.NAV_MENU_MY_ACCOUNT_AFTER} props={props} />
    </Fragment>
  );
};

LoggedIn.propTypes = {
  logout: PropTypes.func.isRequired,
};

LoggedIn.contextTypes = {
  i18n: PropTypes.func,
};

export default LoggedIn;
