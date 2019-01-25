import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_TERMS,
  NAV_MENU_TERMS_AFTER,
  NAV_MENU_TERMS_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import Portal from '@shopgate/pwa-common/components/Portal';
import DescriptionIcon from '@shopgate/pwa-ui-shared/icons/DescriptionIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import { TERMS_PATH } from '../../../../constants';
import connect from '../../../../connector';

const LABEL = 'navigation.terms';

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const TermsButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_TERMS_BEFORE} />
    <Portal name={NAV_MENU_TERMS}>
      <NavDrawer.Item
        label={LABEL}
        icon={DescriptionIcon}
        onClick={navigate(TERMS_PATH, LABEL)}
        testId="navDrawerTermsButton"
      />
    </Portal>
    <Portal name={NAV_MENU_TERMS_AFTER} />
  </Fragment>
);

TermsButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(TermsButton);
