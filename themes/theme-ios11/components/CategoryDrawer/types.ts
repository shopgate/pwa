/**
 * A category as the category pipelines deliver it.
 */
export interface DrawerCategory {
  id: string;
  name?: string;
  path?: string;
  imageUrl?: string | null;
  childrenCount?: number;
  parent?: { id?: string | null; name?: string | null } | null;
  /** The ancestors of the category, root first. Not delivered by every integration. */
  parentCategoriesInfo?: { code: string; name: string }[] | null;
}

/**
 * A level of the drawer: the category whose children it lists.
 */
export interface PathEntry {
  id: string;
  name: string;
}

/**
 * Where the drawer opens.
 */
export interface StartPosition {
  /** The levels from the first below the root down to the visible one. */
  path: PathEntry[];
  /** The category the visitor is currently in. */
  activeId: string | null;
}

/**
 * The part of the store the drawer reads.
 */
export interface CategoryState {
  category: {
    rootCategories: { categories?: string[] | null; isFetching?: boolean; expires?: number };
    categoriesById: Record<string, DrawerCategory | undefined>;
    childrenByCategoryId: Record<string, {
      children?: string[] | null;
      isFetching?: boolean;
    } | undefined>;
  };
}
