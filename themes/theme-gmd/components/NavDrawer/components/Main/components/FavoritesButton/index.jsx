import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_FAVORITES,
  NAV_MENU_FAVORITES_AFTER,
  NAV_MENU_FAVORITES_BEFORE,
  FAVORITES_PATH,
} from '@shopgate/engage/favorites';
import { Portal, NavDrawer, HeartIcon } from '@shopgate/engage/components';
import Badge from './components/Badge';
import connect from '../../../../connector';
import portalProps from '../../../../portalProps';

const LABEL = 'navigation.favorites';

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const FavoritesButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_FAVORITES_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_FAVORITES} props={portalProps}>
      <NavDrawer.Item
        badge={Badge}
        label={LABEL}
        icon={HeartIcon}
        onClick={navigate(FAVORITES_PATH, LABEL)}
        testId="navDrawerFavoritesButton"
      />
    </Portal>
    <Portal name={NAV_MENU_FAVORITES_AFTER} props={portalProps} />
  </Fragment>
);

FavoritesButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(FavoritesButton);
