import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import {
  Accordion, Card, ContextMenu, SurroundPortals,
} from '@shopgate/engage/components';
import { makeGetFavorites } from '@shopgate/pwa-common-commerce/favorites/selectors';
import { FAVORITES_LIST_CONTEXT_MENU } from '../../constants/Portals';
import Item from '../Item';

const styles = {
  root: css({
    margin: '8px 8px 10px',
  }).toString(),
  title: css({
    flex: 1,
  }).toString(),
  divider: css({
    height: 1,
    width: 'calc(100% + 32px)',
    backgroundColor: 'rgb(234, 234, 234)',
    marginLeft: -16,
    marginRight: -16,
    marginBottom: 16,
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
 * @param {Object} _ State
 * @param {Object} props Props
 * @returns {Object}
 */
const makeMapStateToProps = (_, { id }) => {
  const getFavorites = makeGetFavorites(() => id);
  return state => ({
    products: getFavorites(state),
  });
};

/**
 * Favorite List component
 * @return {JSX}
 */
const FavoriteList = ({
  id,
  name,
  products,
  rename,
  remove,
  removeItem,
  disableRemoveList,
}) => (
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
    >
      <div className={styles.divider} />
      {products.length === 0 ? (
        <span>{i18n.text('favorites.empty')}</span>
      ) : null}
      {products.map(product => (
        <Item
          key={product.id}
          product={product}
          listId={id}
          productId={product.id}
          remove={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeItem(product.id);
          }}
        />
      ))}
    </Accordion>
  </Card>
);

FavoriteList.propTypes = {
  disableRemoveList: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  remove: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
};

export default connect(makeMapStateToProps)(FavoriteList);
