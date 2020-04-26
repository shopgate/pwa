import React, { useEffect } from 'react';
import { LoadingIndicator } from '@shopgate/pwa-ui-shared';
import SideNavigationCategoriesItemChildren from './SideNavigationCategoriesItemChildren';
import connect from './SideNavigationCategories.connector';
import { list, loadingIndicator } from './SideNavigationCategories.style';
import { item } from './SideNavigationItem.style';

type Props = {
  categoryId?: string,
  subcategories?: Array,
  fetchCategory: () => any
}

/**
 * The SideNavigationCategories component
 * @returns {JSX}
 */
const SideNavigationCategories = ({ categoryId, subcategories, fetchCategory }: Props) => {
  useEffect(() => {
    if (!subcategories) {
      fetchCategory(categoryId);
    }
  }, [categoryId, fetchCategory, subcategories]);

  if (!subcategories) {
    return (
      <li className={item}>
        <LoadingIndicator className={loadingIndicator} />
      </li>
    );
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
};

export default connect(SideNavigationCategories);
