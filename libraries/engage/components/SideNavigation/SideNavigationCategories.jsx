import React, { useEffect } from 'react';
import SideNavigationCategoriesItem from './SideNavigationCategoriesItem';
import connect from './SideNavigationCategories.connector';
import { list } from './SideNavigationCategories.style';

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
    return null;
  }

  return (
    <li className={list}>
      <ul>
        { subcategories.map(category => (
          <SideNavigationCategoriesItem
            key={category.id}
            categoryId={category.id}
          />
        ))}
      </ul>
    </li>
  );
};

SideNavigationCategories.defaultProps = {
  subcategories: null,
  categoryId: null,
};

export default connect(SideNavigationCategories);
