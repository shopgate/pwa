import React, {
  useState, useCallback, useMemo, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import ArrowDrop from '@shopgate/pwa-ui-shared/icons/ArrowDropIcon';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { ProgressBar } from '@shopgate/pwa-ui-shared';
// eslint-disable-next-line import/no-cycle
import SideNavigationCategoriesItemChildren from './SideNavigationCategoriesItemChildren';
import SideNavigationItem from './SideNavigationItem';
import connect from './SideNavigationCategoriesItem.connector';
import {
  chevronButton, chevronUp, chevronDown, progressBar, open,
} from './SideNavigationCategoriesItem.style';
import { useSideNavigation } from './SideNavigation.hooks';

/**
 * The SideNavigationCategoriesItem component.
 * @param {Object} props The component props.
 * @param {string} [props.categoryId=null] The category ID.
 * @param {Object} props.category The category object.
 * @param {Array} [props.subcategories=null] The list of subcategories.
 * @param {boolean} [props.subcategoriesFetching=false] Whether subcategories are being fetched.
 * @param {Function} props.fetchCategory The function to fetch a category.
 * @param {number} [props.level=0] The current nesting level.
 * @returns {JSX.Element|null} The rendered component.
 */
const SideNavigationCategoriesItem = ({
  categoryId,
  category,
  subcategories,
  subcategoriesFetching,
  fetchCategory,
  level,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    maxCategoryNesting,
    activeCategoryId,
  } = useSideNavigation();

  const hasSubcategories = useMemo(() => category.childrenCount !== 0, [category.childrenCount]);
  const maxNestingReached = useMemo(() => level + 1 === maxCategoryNesting, [
    level,
    maxCategoryNesting,
  ]);

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen);
    if (hasSubcategories && !subcategories) {
      setIsLoading(true);
      fetchCategory(categoryId);
    }
  }, [categoryId, fetchCategory, hasSubcategories, isOpen, subcategories]);

  useEffect(() => {
    if (isLoading && (subcategories || !subcategoriesFetching)) {
      setIsLoading(false);
    }
  }, [isLoading, subcategories, subcategoriesFetching]);

  const buttonRight = useMemo(() => {
    if (!maxNestingReached && hasSubcategories) {
      return (
        <button type="button" onClick={handleClick} className={chevronButton}>
          <ArrowDrop className={(isOpen && subcategories ? chevronUp : chevronDown).toString()} />
        </button>
      );
    }

    return null;
  }, [handleClick, hasSubcategories, isOpen, maxNestingReached, subcategories]);

  if (!category) {
    return null;
  }

  return (
    <SideNavigationItem
      href={`${CATEGORY_PATH}/${bin2hex(categoryId)}`}
      label={category.name}
      level={level}
      buttonRight={buttonRight}
      forceActive={activeCategoryId === categoryId}
      className={level === 0 && isOpen ? open : null}
    >
      { isLoading && (
        <div className={progressBar}>
          <ProgressBar />
        </div>
      )}
      { !maxNestingReached && isOpen && hasSubcategories && subcategories && (
        <SideNavigationCategoriesItemChildren subcategories={subcategories} level={level + 1} />
      )}
    </SideNavigationItem>
  );
};

SideNavigationCategoriesItem.defaultProps = {
  subcategories: null,
  subcategoriesFetching: false,
  categoryId: null,
  level: 0,
};

SideNavigationCategoriesItem.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    childrenCount: PropTypes.number.isRequired,
  }).isRequired,
  fetchCategory: PropTypes.func.isRequired,
  categoryId: PropTypes.string,
  level: PropTypes.number,
  subcategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
  subcategoriesFetching: PropTypes.bool,
};

export default connect(SideNavigationCategoriesItem);
