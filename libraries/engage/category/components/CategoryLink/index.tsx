import type { ComponentType, ReactNode } from 'react';
import { TextLink } from '@shopgate/engage/components';
import { getCategoryRoute, getShowAllProductsFilters } from '@shopgate/engage/category/helpers';
import type { CategoryNavigationItem } from '../../types';

interface LinkProps {
  href: string;
  state: Record<string, unknown>;
  className?: string;
  children?: ReactNode;
}

export interface CategoryLinkProps {
  category: CategoryNavigationItem;
  /** Links to all products of the category instead of the category itself. */
  allProducts?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * A link to a category, or to all products of it.
 * @returns The link.
 */
const CategoryLink = ({
  category,
  allProducts = false,
  className,
  children,
}: CategoryLinkProps) => {
  const Link = TextLink as unknown as ComponentType<LinkProps>;

  if (allProducts) {
    return (
      <Link
        className={className}
        href={`${getCategoryRoute(category.id)}/all`}
        state={{
          categoryName: category.name,
          categoryId: category.id,
          filters: getShowAllProductsFilters(category),
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      className={className}
      href={getCategoryRoute(category.id)}
      state={{
        categoryId: category.id,
        title: category.name,
      }}
    >
      {children}
    </Link>
  );
};

export default CategoryLink;
