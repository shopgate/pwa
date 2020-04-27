import React, {
  useState, useCallback, useMemo, useEffect,
} from 'react';
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

type Props = {
  categoryId?: string,
  level?: number,
  category: Object,
  subcategories?: Array,
  fetchCategory: () => any,
}

/**
 * The SideNavigationCategoriesItem component
 * @returns {JSX}
 */
const SideNavigationCategoriesItem = ({
  categoryId,
  category,
  subcategories,
  fetchCategory,
  level,
}: Props) => {
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
    if (isLoading && subcategories) {
      setIsLoading(false);
    }
  }, [isLoading, subcategories]);

  const buttonRight = useMemo(() => {
    if (!maxNestingReached && hasSubcategories) {
      return (
        <button type="button" onClick={handleClick} className={chevronButton}>
          <ArrowDrop className={(isOpen ? chevronUp : chevronDown).toString()} />
        </button>
      );
    }

    return null;
  }, [handleClick, hasSubcategories, isOpen, maxNestingReached]);

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
  categoryId: null,
  level: 0,
};

export default connect(SideNavigationCategoriesItem);
