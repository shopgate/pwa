import { getCurrentRoute, getRouterStack } from '@shopgate/engage/core/selectors';
import { hex2bin } from '@shopgate/engage/core/helpers';
import { CATEGORY_PATH } from '@shopgate/engage/category/constants';
import { ITEM_PATH } from '@shopgate/engage/product/constants';
import { fetchCategory } from '@shopgate/engage/category/actions';
import type {
  CategoryState, DrawerCategory, PathEntry, StartPosition,
} from './types';

const MAX_DEPTH = 20;

interface StackRoute {
  id?: string;
  pattern?: string;
  params?: { categoryId?: string };
}

type Dispatch = (action: unknown) => unknown;
type GetState = () => CategoryState;

const getRouteCategoryId = (route?: StackRoute | null): string | null => (
  route?.pattern?.startsWith(CATEGORY_PATH) && route.params?.categoryId
    ? hex2bin(route.params.categoryId) as string
    : null
);

/**
 * Finds the category the visitor is in: the category of the current page, or on a product page the
 * category they came from.
 * @param state The application state.
 * @returns The category id, or null outside of categories.
 */
export const getContextCategoryId = (state: object): string | null => {
  const current = getCurrentRoute(state) as StackRoute | null;
  const currentCategoryId = getRouteCategoryId(current);

  if (currentCategoryId || !current?.pattern?.startsWith(ITEM_PATH)) {
    return currentCategoryId;
  }

  const stack = getRouterStack(state) as StackRoute[];
  const index = stack.findIndex(route => route.id === current.id);
  const earlier = (index < 0 ? stack : stack.slice(0, index)).reverse();
  const origin = earlier.find(route => !route.pattern?.startsWith(ITEM_PATH));

  return getRouteCategoryId(origin);
};

const loadCategory = (categoryId: string) => async (
  dispatch: Dispatch,
  getState: GetState
): Promise<DrawerCategory | null> => {
  const cached = getState().category.categoriesById[categoryId];

  if (cached?.name) {
    return cached;
  }

  try {
    await dispatch(fetchCategory(categoryId));
  } catch (error) {
    return null;
  }

  const loaded = getState().category.categoriesById[categoryId];
  return loaded?.name ? loaded : null;
};

/**
 * Resolves the level the drawer opens at for a category: its children, or for a category without
 * children the level it is listed in.
 * @param categoryId The category the visitor is in.
 * @returns A thunk that resolves with the start position.
 */
export const resolveStartPosition = (categoryId: string | null) => async (
  dispatch: Dispatch,
  getState: GetState
): Promise<StartPosition> => {
  const category = categoryId
    ? await loadCategory(categoryId)(dispatch, getState)
    : null;

  if (!category) {
    return {
      path: [],
      activeId: null,
    };
  }

  let ancestors: PathEntry[] = [];

  if (Array.isArray(category.parentCategoriesInfo)) {
    ancestors = category.parentCategoriesInfo.map(({ code, name }) => ({
      id: code,
      name,
    }));
  } else {
    let { parent } = category;

    while (parent?.id && ancestors.length < MAX_DEPTH) {
      ancestors.unshift({
        id: parent.id,
        name: parent.name || '',
      });
      // eslint-disable-next-line no-await-in-loop
      parent = (await loadCategory(parent.id)(dispatch, getState))?.parent;
    }
  }

  return {
    path: category.childrenCount ? [...ancestors, {
      id: category.id,
      name: category.name || '',
    }] : ancestors,
    activeId: category.id,
  };
};
