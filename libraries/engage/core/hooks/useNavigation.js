import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router/historyPush';
import { historyPop } from '@shopgate/pwa-common/actions/router/historyPop';
import { historyReplace } from '@shopgate/pwa-common/actions/router/historyReplace';
import { historyReset } from '@shopgate/pwa-common/actions/router/historyReset';

/**
 * Provides functions for navigation.
 * @returns {Object}
 */
export function useNavigation() {
  const { store } = useContext(ReactReduxContext);

  return {
    push: params => store.dispatch(historyPush(params)),
    pop: () => store.dispatch(historyPop()),
    replace: params => store.dispatch(historyReplace(params)),
    reset: () => store.dispatch(historyReset()),
  };
}
