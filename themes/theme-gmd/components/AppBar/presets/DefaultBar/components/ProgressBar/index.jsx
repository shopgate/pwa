import React from 'react';
import { RouteContext, LoadingContext } from '@shopgate/engage/core';
import { ProgressBar } from '@shopgate/engage/components';
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
