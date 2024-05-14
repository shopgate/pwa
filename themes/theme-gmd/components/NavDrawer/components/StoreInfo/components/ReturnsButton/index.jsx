import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_RETURN_POLICY,
  NAV_MENU_RETURN_POLICY_AFTER,
  NAV_MENU_RETURN_POLICY_BEFORE,
} from '@shopgate/pwa-common-commerce/market/constants/Portals';
import Portal from '@shopgate/pwa-common/components/Portal';
import DescriptionIcon from '@shopgate/pwa-ui-shared/icons/DescriptionIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import { RETURN_POLICY_PATH } from '@shopgate/engage/page/constants';
import portalProps from '../../../../portalProps';
import connect from '../../../../connector';

const LABEL = 'navigation.return_policy';

/**
 * @param {Object} props The component props
 * @param {Function} props.navigate The navigate props
 * @returns {JSX.Element}
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
