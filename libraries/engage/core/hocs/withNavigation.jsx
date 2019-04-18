import React from 'react';
import { ReactReduxContext } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router/historyPush';
import { historyPop } from '@shopgate/pwa-common/actions/router/historyPop';
import { historyReplace } from '@shopgate/pwa-common/actions/router/historyReplace';
import { historyReset } from '@shopgate/pwa-common/actions/router/historyReset';

/**
 * Injects navigation functions into the desired component.
 * @param {Function} WrappedComponent The react component to wrap.
 * @returns {JSX}
 */
export function withNavigation(WrappedComponent) {
  return props => (
    <ReactReduxContext.Consumer>
      {({ store }) => (
        <WrappedComponent
          {...props}
          push={params => store.dispatch(historyPush(params))}
          pop={() => store.dispatch(historyPop())}
          replace={params => store.dispatch(historyReplace(params))}
          reset={() => store.dispatch(historyReset())}
        />
      )}
    </ReactReduxContext.Consumer>
  );
}
