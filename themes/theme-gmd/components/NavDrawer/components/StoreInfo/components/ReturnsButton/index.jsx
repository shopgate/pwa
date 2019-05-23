import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_RETURN_POLICY,
  NAV_MENU_RETURN_POLICY_AFTER,
  NAV_MENU_RETURN_POLICY_BEFORE,
} from '@shopgate/engage/market';
import { Portal, NavDrawer, DescriptionIcon } from '@shopgate/engage/components';
import { RETURN_POLICY_PATH } from '../../../../constants';
import portalProps from '../../../../portalProps';
import connect from '../../../../connector';

const LABEL = 'navigation.return_policy';

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const ReturnsButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_RETURN_POLICY_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_RETURN_POLICY} props={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={DescriptionIcon}
        onClick={navigate(RETURN_POLICY_PATH, LABEL)}
        testId="navDrawerReturnsButton"
      />
    </Portal>
    <Portal name={NAV_MENU_RETURN_POLICY_AFTER} props={portalProps} />
  </Fragment>
);

ReturnsButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(ReturnsButton);
