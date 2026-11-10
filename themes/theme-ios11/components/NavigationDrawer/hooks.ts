import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@shopgate/engage/core/hooks';

/**
 * Dispatch that also accepts the thunks the untyped action creators return.
 */
type ThunkDispatch = (action: unknown) => unknown;

/**
 * Provides the dispatch used for the untyped legacy action creators.
 * @returns The dispatch function.
 */
export const useThunkDispatch = (): ThunkDispatch =>
  useDispatch() as unknown as ThunkDispatch;

/**
 * Provides the navigation callback used by every nav drawer entry.
 * @returns A factory that builds the click handler for one entry.
 */
export const useNavDrawerNavigate = () => {
  const { push } = useNavigation();

  return useCallback(
    (pathname: string, title?: string) => () => push({
      pathname,
      state: { title },
    }),
    [push]
  );
};
