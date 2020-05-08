import React, { useContext } from 'react';
import { RouteContext } from '@shopgate/pwa-common/context';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { ProgressBar } from '@shopgate/pwa-ui-shared';
import styles from './style';

/**
 * @returns {JSX}
 */
function Progress() {
  const { visible, pathname } = useContext(RouteContext);
  const { isLoading } = useContext(LoadingContext);

  return (
    <div className={styles}>
      <ProgressBar isVisible={visible && isLoading(pathname)} />
    </div>
  );
}

export default Progress;
