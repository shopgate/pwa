import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CATEGORY_PATTERN,
  CATEGORY_FILTER_PATTERN,
} from '@shopgate/pwa-common-commerce/category/constants';
import {
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import Context from './SideNavigationProvider.context';
import connect from './SideNavigationProvider.connector';

const categoryPatterns = [CATEGORY_PATTERN, CATEGORY_FILTER_PATTERN];
const itemPatterns = [
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
];

/**
 * SideNavigation Provider
 * @param {Object} props The component props.
 * @param {number} props.maxCategoryNesting Maximum category nesting level.
 * @param {Array} [props.routePatternBlacklist=[]] List of route patterns to blacklist.
 * @param {Object} [props.currentParams=null] Current route parameters.
 * @param {string} [props.currentPathname=''] Current pathname.
 * @param {Object} [props.currentRoute=null] Current route object.
 * @param {boolean} props.isLoggedIn Whether the user is logged in.
 * @param {Function} props.logout Logout function.
 * @param {React.ReactNode} props.children Child components.
 * @returns {JSX.Element} The rendered component.
 */
const SideNavigationProvider = ({
  maxCategoryNesting,
  routePatternBlacklist,
  currentParams,
  currentPathname,
  currentRoute,
  isLoggedIn,
  logout,
  children,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!currentRoute) {
      return;
    }

    const { pattern } = currentRoute;

    if (categoryPatterns.includes(pattern)) {
      const { categoryId } = currentParams;
      setActiveCategoryId(hex2bin(categoryId));
    } else if (!itemPatterns.includes(pattern)) {
      setActiveCategoryId(null);
    }

    setIsVisible(!routePatternBlacklist.includes(pattern));
  }, [currentRoute, currentParams, routePatternBlacklist]);

  const value = useMemo(
    () => ({
      maxCategoryNesting,
      currentParams,
      currentPathname,
      currentRoute,
      isLoggedIn,
      logout,
      activeCategoryId,
      isVisible,
    }),
    [activeCategoryId, currentParams, currentPathname,
      currentRoute, isLoggedIn, isVisible, logout, maxCategoryNesting]
  );

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

SideNavigationProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  maxCategoryNesting: PropTypes.number.isRequired,
  currentParams: PropTypes.shape({
    categoryId: PropTypes.string,
  }),
  currentPathname: PropTypes.string,
  currentRoute: PropTypes.shape({
    pattern: PropTypes.string.isRequired,
  }),
  routePatternBlacklist: PropTypes.arrayOf(PropTypes.string),
};

SideNavigationProvider.defaultProps = {
  currentParams: null,
  currentPathname: '',
  routePatternBlacklist: [],
  currentRoute: null,
};

export default connect(SideNavigationProvider);
