import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_CATEGORIES,
  NAV_MENU_CATEGORIES_AFTER,
  NAV_MENU_CATEGORIES_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import Portal from '@shopgate/pwa-common/components/Portal';
import ViewListIcon from '@shopgate/pwa-ui-shared/icons/ViewListIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import connect from '../../../../connector';
import portalProps from '../../../../portalProps';

const LABEL = 'navigation.categories';

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const CategoryButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_CATEGORIES_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_CATEGORIES} props={portalProps}>
      <NavDrawer.Item
        aria-hidden={false}
        label={LABEL}
        icon={ViewListIcon}
        onClick={navigate(CATEGORY_PATH, LABEL)}
        testId="navDrawerCategoriesButton"
      />
    </Portal>
    <Portal name={NAV_MENU_CATEGORIES_AFTER} props={portalProps} />
  </Fragment>
);

CategoryButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(CategoryButton);
