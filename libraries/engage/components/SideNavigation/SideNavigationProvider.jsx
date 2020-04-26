import React, { useState, useMemo, useEffect } from 'react';
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

type Props = {
  maxCategoryNesting: number,
  currentParams?: Object,
  currentPathname?: string,
  currentRoute?: Object,
  isLoggedIn: boolean,
  logout: () => any,
  children: any
}

const categoryPatterns = [CATEGORY_PATTERN, CATEGORY_FILTER_PATTERN];
const itemPatterns = [
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
];

/**
 * SideNavigation Provider
 * @returns {JSX}
 */
const SideNavigationProvider = ({
  maxCategoryNesting,
  currentParams,
  currentPathname,
  currentRoute,
  isLoggedIn,
  logout,
  children,
}:Props) => {
  const [activeCategoryId, setActiveCategoryId] = useState(null);

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
  });
  const value = useMemo(
    () => ({
      maxCategoryNesting,
      currentParams,
      currentPathname,
      currentRoute,
      isLoggedIn,
      logout,
      activeCategoryId,
    }),
    [
      activeCategoryId,
      currentParams,
      currentPathname,
      currentRoute,
      isLoggedIn,
      logout,
      maxCategoryNesting,
    ]
  );

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

SideNavigationProvider.defaultProps = {
  currentParams: null,
  currentPathname: '',
  currentRoute: null,
};

export default connect(SideNavigationProvider);
