import { getCurrentRoute, getRouterStack } from '@shopgate/engage/core/selectors';
import { hex2bin } from '@shopgate/engage/core/helpers';
import { ERROR_HANDLE_SUPPRESS } from '@shopgate/engage/core/constants';
import { PipelineRequest } from '@shopgate/engage/core/classes';
import { CATEGORY_PATH, SHOPGATE_CATALOG_GET_CATEGORY } from '@shopgate/engage/category/constants';
import { ITEM_PATH } from '@shopgate/engage/product/constants';
import { receiveCategories } from '@shopgate/engage/category/actions';
import type {
  CategoryState, DrawerCategory, PathEntry, StartPosition,
} from './types';

const MAX_DEPTH = 20;
const WAIT_STEP = 50;
const WAIT_LIMIT = 15000;

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
  const earlier = (index < 0 ? [...stack] : stack.slice(0, index)).reverse();
  const origin = earlier.find(route => !route.pattern?.startsWith(ITEM_PATH));

  return getRouteCategoryId(origin);
};

/**
 * Loads a category for the drawer. Unlike the category page it shows no error dialog: the drawer
 * falls back to what it already knows.
 * @param categoryId The id of the category.
 * @returns A thunk that resolves with the category, or null when it is unknown.
 */
export const loadCategory = (categoryId: string) => async (
  dispatch: Dispatch,
  getState: GetState
): Promise<DrawerCategory | null> => {
  const cached = getState().category.categoriesById[categoryId];

  if (cached?.name) {
    return cached;
  }

  if (cached?.isFetching) {
    for (let waited = 0; waited < WAIT_LIMIT; waited += WAIT_STEP) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        setTimeout(resolve, WAIT_STEP);
      });
      const current = getState().category.categoriesById[categoryId];

      if (!current?.isFetching) {
        return current?.name ? current : null;
      }
    }

    return null;
  }

  try {
    const result = await new PipelineRequest(SHOPGATE_CATALOG_GET_CATEGORY)
      .setInput({
        categoryId,
        includeChildren: true,
      })
      .setHandleErrors(ERROR_HANDLE_SUPPRESS)
      .dispatch() as DrawerCategory & { children?: DrawerCategory[] };
    dispatch(receiveCategories([{
      ...result,
      id: categoryId,
    }]));
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

  if (category.parentCategoriesInfo?.length || !category.parent?.id) {
    ancestors = (category.parentCategoriesInfo || []).map(({ code, name }) => ({
      id: code,
      name,
    }));
  } else {
    let parent: DrawerCategory['parent'] = category.parent ?? null;

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
