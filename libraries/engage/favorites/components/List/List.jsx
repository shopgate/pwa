import React, {
  Fragment, useCallback, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import {
  Accordion, Card, ContextMenu, SurroundPortals, RippleButton,
} from '@shopgate/engage/components';
import {
  getFavoritesCount,
  makeGetFavoritesIdsByList,
  getHasMultipleFavoritesListsSupport,
} from '@shopgate/engage/favorites';
import { FAVORITES_LIST_CONTEXT_MENU } from '../../constants/Portals';
import Item from '../Item';
import { ProductProvider } from '../../../product';
import { FAVORITES_SHOW_LIMIT } from '../../constants/constants';

const { colors, variables } = themeConfig;

const styles = {
  root: css({
    margin: '8px 8px 10px',
  }).toString(),
  rootNoFavoritesLists: css({
    background: colors.light,
    flexGrow: 1,
    paddingTop: variables.gap.xsmall,
    paddingLeft: '16px',
    paddingRight: '16px',
  }).toString(),
  title: css({
    flex: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  }).toString(),
  divider: css({
    height: 1,
    width: 'calc(100% + 32px)',
    backgroundColor: 'rgb(234, 234, 234)',
    marginLeft: -16,
    marginRight: -16,
    marginBottom: 16,
  }).toString(),
  spacer: css({
    height: 1,
    width: 'calc(100% + 32px)',
    marginLeft: -16,
    marginRight: -16,
    marginBottom: 16,
  }).toString(),
  loadMoreButton: css({
    width: 'calc(100% - 32px)',
    margin: '16px 16px 0 16px',
    borderRadius: 5,
  }).toString(),
};

/**
 * Favorite List Label component
 * @return {JSX}
 */
const FavoriteListLabel = ({
  id, title, rename, remove, disableRemoveList,
}) => (
  <Fragment>
    <span className={styles.title}>
      {title}
    </span>
    <SurroundPortals portalName={FAVORITES_LIST_CONTEXT_MENU} portalProps={{ id }}>
      <ContextMenu>
        <ContextMenu.Item onClick={rename}>
          {i18n.text('favorites.rename_list')}
        </ContextMenu.Item>
        <ContextMenu.Item onClick={remove} disabled={disableRemoveList}>
          {i18n.text('favorites.remove_list')}
        </ContextMenu.Item>
      </ContextMenu>
    </SurroundPortals>
  </Fragment>
);

FavoriteListLabel.propTypes = {
  disableRemoveList: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

/**
 * The content of a favorites list
 * @returns {JSX}
 */
const FavoritesListContent = ({
  id,
  productIds,
  addToCart,
  removeItem,
  shouldShowLoadMoreButton,
  loadMore,
  hasMultipleFavoritesListsSupport,
}) => (
  <>
    {hasMultipleFavoritesListsSupport ? (
      <div className={styles.divider} />
    ) : (
      <div className={styles.spacer} />
    )}

    {productIds.length === 0 ? (
      <span>{i18n.text('favorites.empty')}</span>
    ) : null}

    {productIds.map(({ productId }) => (
      <ProductProvider productId={productId} key={productId}>
        {({ product }) => (
          product ? (
            <Item
              key={product.id}
              product={product}
              listId={id}
              productId={product.id}
              addToCart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                return addToCart(product);
              }}
              remove={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeItem(product.id);
              }}
            />
          ) : null)
        }
      </ProductProvider>
    ))}

    {shouldShowLoadMoreButton &&
      <RippleButton
        type="primary"
        className={styles.loadMoreButton}
        onClick={loadMore}
      >
        {i18n.text('favorites.load_more_button')}
      </RippleButton>
    }

    <div className={styles.spacer} />
  </>
);

FavoritesListContent.propTypes = {
  addToCart: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  loadMore: PropTypes.func.isRequired,
  productIds: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeItem: PropTypes.func.isRequired,
  shouldShowLoadMoreButton: PropTypes.bool.isRequired,
  hasMultipleFavoritesListsSupport: PropTypes.bool,
};

FavoritesListContent.defaultProps = {
  hasMultipleFavoritesListsSupport: false,
};

/**
 * @param {Object} _ State
 * @param {Object} props Props
 * @returns {Object}
 */
const makeMapStateToProps = (_, { id }) => {
  const getFavoritesIds = makeGetFavoritesIdsByList(() => id);
  return state => ({
    favoriteIds: getFavoritesIds(state),
    favoritesCount: getFavoritesCount(state),
    hasMultipleFavoritesListsSupport: getHasMultipleFavoritesListsSupport(state),
  });
};

/**
 * Favorite List component
 * @return {JSX}
 */
const FavoriteList = ({
  id,
  name,
  favoriteIds,
  rename,
  remove,
  removeItem,
  addToCart,
  disableRemoveList,
  hasMultipleFavoritesListsSupport,
}) => {
  const [offset, setOffset] = useState(FAVORITES_SHOW_LIMIT);

  const productIds = favoriteIds.slice(0, offset)
    .map(productId => ({ productId }));

  const allFavoritesLoaded = favoriteIds.length - productIds.length > 0;

  const [shouldShowLoadMoreButton, setShouldShowLoadMoreButton] = useState(allFavoritesLoaded);

  const loadMore = useCallback(() => {
    setOffset(offset + FAVORITES_SHOW_LIMIT);
  }, [offset]);

  useEffect(() => {
    setShouldShowLoadMoreButton(allFavoritesLoaded);
  }, [offset, allFavoritesLoaded]);

  return (
    hasMultipleFavoritesListsSupport ? (
      <Card className={styles.root}>
        <Accordion
          className=""
          openWithChevron
          renderLabel={() =>
            <FavoriteListLabel
              id={id}
              title={name}
              rename={newName => rename(id, newName)}
              remove={remove}
              disableRemoveList={disableRemoveList}
            />
          }
          chevronPosition="left"
          startOpened
          testId={id}
        >
          <FavoritesListContent
            addToCart={addToCart}
            id={id}
            loadMore={loadMore}
            productIds={productIds}
            removeItem={removeItem}
            shouldShowLoadMoreButton={shouldShowLoadMoreButton}
            hasMultipleFavoritesListsSupport={hasMultipleFavoritesListsSupport}
          />
        </Accordion>
      </Card>
    ) : (
      <div className={styles.rootNoFavoritesLists}>
        <FavoritesListContent
          addToCart={addToCart}
          id={id}
          loadMore={loadMore}
          productIds={productIds}
          removeItem={removeItem}
          shouldShowLoadMoreButton={shouldShowLoadMoreButton}
        />
      </div>
    )
  );
};

FavoriteList.propTypes = {
  addToCart: PropTypes.func.isRequired,
  disableRemoveList: PropTypes.bool.isRequired,
  favoriteIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
  hasMultipleFavoritesListsSupport: PropTypes.bool,
};

FavoriteList.defaultProps = {
  hasMultipleFavoritesListsSupport: false,
};

export default connect(makeMapStateToProps)(FavoriteList);
