import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_FAVORITES,
  NAV_MENU_FAVORITES_AFTER,
  NAV_MENU_FAVORITES_BEFORE,
} from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import Portal from '@shopgate/pwa-common/components/Portal';
import HeartIcon from '@shopgate/pwa-ui-shared/icons/HeartIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import consume from '../../consumer';

const LABEL = 'navigation.favorites';

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const FavoritesButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_FAVORITES_BEFORE} />
    <Portal name={NAV_MENU_FAVORITES}>
      <NavDrawer.Item
        label={LABEL}
        icon={HeartIcon}
        onClick={navigate(FAVORITES_PATH, LABEL)}
      />
    </Portal>
    <Portal name={NAV_MENU_FAVORITES_AFTER} />
  </Fragment>
);

FavoritesButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default consume(FavoritesButton);
