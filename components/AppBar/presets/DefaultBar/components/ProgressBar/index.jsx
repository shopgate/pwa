import React from 'react';
import { RouteContext } from '@shopgate/pwa-common/context';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { ProgressBar } from '@shopgate/pwa-ui-shared';

export default () => (
  <RouteContext.Consumer>
    {({ visible, pathname }) => (
      <LoadingContext.Consumer>
        {({ isLoading }) => (
          <ProgressBar isVisible={visible && isLoading(pathname)} />
        )}
      </LoadingContext.Consumer>
    )}
  </RouteContext.Consumer>
);
