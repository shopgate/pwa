import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  CATEGORY_PATH,
  NAV_MENU_CATEGORIES,
  NAV_MENU_CATEGORIES_AFTER,
  NAV_MENU_CATEGORIES_BEFORE,
} from '@shopgate/engage/category';
import { Portal, NavDrawer, ViewListIcon } from '@shopgate/engage/components';
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
