import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_TERMS,
  NAV_MENU_TERMS_AFTER,
  NAV_MENU_TERMS_BEFORE,
} from '@shopgate/engage/core';
import { Portal, NavDrawer, DescriptionIcon } from '@shopgate/engage/components';
import { TERMS_PATH } from '../../../../constants';
import portalProps from '../../../../portalProps';
import connect from '../../../../connector';

const LABEL = 'navigation.terms';

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const TermsButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_TERMS_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_TERMS} props={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={DescriptionIcon}
        onClick={navigate(TERMS_PATH, LABEL)}
        testId="navDrawerTermsButton"
      />
    </Portal>
    <Portal name={NAV_MENU_TERMS_AFTER} props={portalProps} />
  </Fragment>
);

TermsButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(TermsButton);
