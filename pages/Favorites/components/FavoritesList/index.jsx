import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ViewContext, InfiniteContainer, LoadingIndicator, CardList,
} from '@shopgate/engage/components';
import { ProductProvider } from '@shopgate/engage/product';
import { FAVORITES_SHOW_LIMIT } from '../../constants';
import styles from './style';
import Item from './components/Item';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const FavoritesList = ({ favoriteIds, favoritesCount }) => {
  const [offset, setOffset] = useState(0);

  const loadMore = useCallback((next) => {
    setOffset(next);
  }, []);

  const productIds = favoriteIds.slice(0, offset + FAVORITES_SHOW_LIMIT)
    // Shape id mandatory fo infinite load
    .map(id => ({ productId: id }));

  return (
    <div className={styles.container}>
      <ViewContext.Consumer>
        {({ getContentRef }) => (
          <InfiniteContainer
            containerRef={getContentRef()}
            wrapper={({ children }) => (
              <CardList>
                {children}
              </CardList>
            )}
            iterator={({ productId }) => (
              <ProductProvider productId={productId} key={productId}>
                {({ product }) => <Item product={product} /> }
              </ProductProvider>
            )}
            loader={loadMore}
            items={productIds}
            loadingIndicator={<LoadingIndicator />}
            totalItems={favoritesCount}
            initialLimit={FAVORITES_SHOW_LIMIT}
            limit={FAVORITES_SHOW_LIMIT}
          />
        )}
      </ViewContext.Consumer>
    </div>
  );
};
FavoritesList.propTypes = {
  favoriteIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  favoritesCount: PropTypes.number.isRequired,
};

export default connect(FavoritesList);
