import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import {
  getCategory,
  getCategoryChildren,
  areCategoryChildrenFetching,
  getCategoryChildCount,
} from '@shopgate/engage/category/selectors';
import { CategoryChips } from '@shopgate/engage/category/components';

interface SubcategoryChipsProps {
  categoryId: string;
  showImages?: boolean;
  showAllProducts?: boolean;
}

/**
 * The subcategories of a category as a row of chips above its products.
 * @returns The chips.
 */
const SubcategoryChips = ({
  categoryId,
  showImages = false,
  showAllProducts = false,
}: SubcategoryChipsProps) => {
  const props = useMemo(() => ({ categoryId }), [categoryId]);
  const category = useSelector(state => getCategory(state, props));
  const categories = useSelector(state => getCategoryChildren(state, props));
  const isFetching = useSelector(state => areCategoryChildrenFetching(state, props));
  const childrenCount = useSelector(state => getCategoryChildCount(state, props));

  return (
    <CategoryChips
      categories={categories}
      prerender={isFetching ? childrenCount : 0}
      showImages={showImages}
      parentCategory={category}
      showAllProducts={showAllProducts && !hasNewServices()}
    />
  );
};

export default SubcategoryChips;
