import React from 'react';
import { RouteContext } from '@shopgate/pwa-common/context';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { ProgressBar } from '@shopgate/pwa-ui-shared';
import { getCart } from '@shopgate/pwa-common-commerce/cart';
import { useSelector } from 'react-redux';

export default () => {
  const { isFetching } = useSelector(getCart);

  return (
    <RouteContext.Consumer>
      {({ visible, pathname }) => (
        <LoadingContext.Consumer>
          {({ isLoading }) => {
            const isCartLoading = pathname === '/cart' && (isLoading('/cart') || isFetching);
            return (
              <ProgressBar isVisible={visible && (isCartLoading || isLoading(pathname))} />
            );
          }}
        </LoadingContext.Consumer>
      )}
    </RouteContext.Consumer>
  );
};
