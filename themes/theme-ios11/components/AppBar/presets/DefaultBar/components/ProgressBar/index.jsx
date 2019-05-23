import React from 'react';
import { RouteContext } from '@shopgate/engage/core';
import { LoadingContext } from '@shopgate/engage/core';
import { ProgressBar } from '@shopgate/engage/components';

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
