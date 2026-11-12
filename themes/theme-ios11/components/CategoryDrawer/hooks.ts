import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@shopgate/engage/core/hooks';
import { fetchCategoryChildren, fetchRootCategories } from '@shopgate/engage/category/actions';
import type { CategoryState } from './types';

interface LevelState {
  /** The ids of the categories of the level, or null until they are loaded. */
  ids: string[] | null;
  isLoading: boolean;
  hasError: boolean;
  retry: () => void;
}

/**
 * Loads the categories of one level of the drawer.
 * @param categoryId The category whose children the level lists, or null for the root level.
 * @returns The category ids and the loading state of the level.
 */
export const useLevel = (categoryId: string | null): LevelState => {
  const dispatch = useAppDispatch();
  const [attempt, setAttempt] = useState(0);
  const [settledAttempt, setSettledAttempt] = useState(-1);

  const ids = useSelector((state: CategoryState) => (categoryId
    ? state.category.childrenByCategoryId[categoryId]?.children
    : state.category.rootCategories.categories)) ?? null;

  const isFetching = useSelector((state: CategoryState) => Boolean(categoryId
    ? state.category.childrenByCategoryId[categoryId]?.isFetching
    : state.category.rootCategories.isFetching));

  const isRootReceived = useSelector((state: CategoryState) => (
    !categoryId && !!state.category.rootCategories.expires
  ));

  useEffect(() => {
    let isCurrent = true;
    const action = categoryId ? fetchCategoryChildren(categoryId) : fetchRootCategories();

    Promise.resolve(dispatch(action)).catch(() => null).then(() => {
      if (isCurrent) {
        setSettledAttempt(attempt);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [attempt, categoryId, dispatch]);

  const retry = useCallback(() => setAttempt(count => count + 1), []);
  const isSettled = settledAttempt === attempt && !isFetching;

  return {
    ids: ids || (isSettled && isRootReceived ? [] : null),
    isLoading: !ids && !isSettled,
    hasError: !ids && isSettled && !isRootReceived,
    retry,
  };
};
