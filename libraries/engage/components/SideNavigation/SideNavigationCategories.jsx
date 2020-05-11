import React, { useEffect } from 'react';
import { LoadingIndicator } from '@shopgate/pwa-ui-shared';
import SideNavigationCategoriesItemChildren from './SideNavigationCategoriesItemChildren';
import connect from './SideNavigationCategories.connector';
import { list, loadingIndicator } from './SideNavigationCategories.style';
import { item } from './SideNavigationItem.style';

type Props = {
  categoryId?: string,
  rootCategoriesFetching?: boolean,
  subcategories?: Array,
  fetchCategory: () => any
}

/**
 * The SideNavigationCategories component
 * @returns {JSX}
 */
const SideNavigationCategories = ({
  categoryId,
  subcategories,
  fetchCategory,
  rootCategoriesFetching,
}: Props) => {
  useEffect(() => {
    if (!subcategories) {
      fetchCategory(categoryId);
    }
  }, [categoryId, fetchCategory, subcategories]);

  if (!subcategories && rootCategoriesFetching) {
    return (
      <li className={item}>
        <LoadingIndicator className={loadingIndicator} />
      </li>
    );
  }

  if (!subcategories || (Array.isArray(subcategories) && subcategories.length === 0)) {
    return null;
  }

  return (
    <li className={list}>
      <SideNavigationCategoriesItemChildren level={0} subcategories={subcategories} />
    </li>
  );
};

SideNavigationCategories.defaultProps = {
  subcategories: null,
  categoryId: null,
  rootCategoriesFetching: false,
};

export default connect(SideNavigationCategories);
