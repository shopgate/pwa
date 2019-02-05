import React from 'react';
import { RouteContext } from '@shopgate/pwa-common/context';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { ProgressBar } from '@shopgate/pwa-ui-shared';
import styles from './style';

/**
 * @returns {JSX}
 */
function Progress() {
  return (
    <RouteContext.Consumer>
      {({ visible, pathname }) => (
        <LoadingContext.Consumer>
          {({ isLoading }) => (
            <div className={styles}>
              <ProgressBar isVisible={visible && isLoading(pathname)} />
            </div>
          )}
        </LoadingContext.Consumer>
      )}
    </RouteContext.Consumer>
  );
}

export default Progress;
