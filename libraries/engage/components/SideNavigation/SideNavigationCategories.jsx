import React, { useEffect } from 'react';
import { LoadingIndicator } from '@shopgate/pwa-ui-shared';
import PropTypes from 'prop-types';
import SideNavigationCategoriesItemChildren from './SideNavigationCategoriesItemChildren';
import connect from './SideNavigationCategories.connector';
import { list, loadingIndicator } from './SideNavigationCategories.style';
import { item } from './SideNavigationItem.style';

/**
 * The SideNavigationCategories component.
 * @param {Object} props - The component props.
 * @property {string} [props.categoryId] - The ID of the category to fetch.
 * @property {boolean} [props.rootCategoriesFetching] - whether root categories are being fetched.
 * @property {Array} [props.subcategories] - The list of subcategories.
 * @property {Function} props.fetchCategory - Function to fetch the category data.
 * @returns {JSX.Element|null} The rendered component or null.
 */
const SideNavigationCategories = ({
  categoryId,
  subcategories,
  fetchCategory,
  rootCategoriesFetching,
}) => {
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

SideNavigationCategories.propTypes = {
  fetchCategory: PropTypes.func.isRequired,
  categoryId: PropTypes.string,
  rootCategoriesFetching: PropTypes.bool,
  subcategories: PropTypes.arrayOf(PropTypes.shape()),
};

SideNavigationCategories.defaultProps = {
  categoryId: null,
  rootCategoriesFetching: false,
  subcategories: null,
};

export default connect(SideNavigationCategories);
