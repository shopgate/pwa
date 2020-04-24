import React from 'react';
// eslint-disable-next-line import/no-cycle
import SideNavigationCategoriesItem from './SideNavigationCategoriesItem';

type Props = {
  subcategories: Array,
  level: number
};

/**
 * The SideNavigationCategoriesItemChildren component
 * @returns {JSX}
 */
const SideNavigationCategoriesItemChildren = ({ subcategories, level }: Props) => (
  <ul>
    {
      subcategories.map(category => (
        <SideNavigationCategoriesItem
          key={category.id}
          level={level}
          categoryId={category.id}
        />
      ))
    }
  </ul>
);

export default SideNavigationCategoriesItemChildren;
