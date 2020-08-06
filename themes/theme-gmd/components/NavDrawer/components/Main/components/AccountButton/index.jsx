import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import AccountBoxIcon from '@shopgate/pwa-ui-shared/icons/AccountBoxIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import { ACCOUNT_PATH } from '@shopgate/engage/account';
import connect from '../../../../connector';

const LABEL = 'navigation.your_account';

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const AccountButton = ({ navigate }) => (
  <Fragment>
    <NavDrawer.Item
      label={LABEL}
      icon={AccountBoxIcon}
      onClick={navigate(ACCOUNT_PATH, LABEL)}
      testId="navDrawerAccountButton"
    />
  </Fragment>
);

AccountButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(AccountButton);
