import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import { RippleButton, SurroundPortals } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import {
  getFavoritesLists,
  isInitialLoading,
} from '@shopgate/pwa-common-commerce/favorites/selectors';
import addFavoritesList from '@shopgate/pwa-common-commerce/favorites/actions/addFavoritesList';
import updateFavoritesList from '@shopgate/pwa-common-commerce/favorites/actions/updateFavoritesList';
import removeFavoritesList from '@shopgate/pwa-common-commerce/favorites/actions/removeFavoritesList';
import { removeFavorites } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import addProductsToCart from '@shopgate/pwa-common-commerce/cart/actions/addProductsToCart';
import { getWishlistMode } from '@shopgate/engage/core/selectors/shopSettings';
import appConfig from '@shopgate/pwa-common/helpers/config';

import List from '../List';
import ListsModal from './ListsModal';
import {
  FAVORITES_LIST_ADD_BUTTON,
  FAVORITES_LIST,
} from '../../constants/Portals';

/**
 * @param {Object} state State
 * @returns {Object}
 */
const mapStateToProps = state => ({
  isInitializing: isInitialLoading(state),
  lists: getFavoritesLists(state),
  wishlistMode: getWishlistMode(state),
});

/**
 * @param {Object} dispatch Dispatch
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  addList: name => dispatch(addFavoritesList(name)),
  updateList: (id, name) => dispatch(updateFavoritesList(id, name)),
  removeList: id => dispatch(removeFavoritesList(id)),
  removeItem: (listId, productId) => dispatch(removeFavorites(productId, false, listId)),
  addToCart: (...params) => dispatch(addProductsToCart(...params)),
});

const styles = {
  root: css({}),
  addButton: css({
    width: 'calc(100% - 32px)',
    margin: 16,
    backgroundColor: 'var(--color-primary)',
    borderRadius: 5,
  }).toString(),
};

/**
 * @param {Object} props Props
 * @returns {Object}
 */
const FavoriteLists = ({
  addList,
  updateList,
  removeList,
  removeItem,
  lists,
  isInitializing,
}) => {
  // Modal for renaming and adding.
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalTarget, setModalTarget] = useState(null);

  const openAddModal = useCallback(() => {
    setModalOpen(true);
    setModalType('add_list');
    setModalTarget(null);
  }, []);

  const openRenameModal = useCallback((code) => {
    setModalOpen(true);
    setModalType('rename_list');
    setModalTarget(code);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalType(null);
    setModalTarget(null);
  }, []);

  const confirmModal = useCallback((name) => {
    if (modalType === 'add_list') {
      addList(name);
    } else if (modalType === 'rename_list') {
      updateList(modalTarget, name);
    }
    closeModal();
  }, [addList, closeModal, modalTarget, modalType, updateList]);

  if (isInitializing) {
    return null;
  }

  return (
    <div className={styles.root}>
      {lists.map(list => (
        <SurroundPortals key={list.id} portalName={FAVORITES_LIST} portalProps={list}>
          <List
            id={list.id}
            name={list.name}
            rename={openRenameModal}
            remove={() => removeList(list.id)}
            removeItem={productId => removeItem(list.id, productId)}
            disableRemoveList={lists.length < 2}
          />
        </SurroundPortals>
      ))}
      {modalOpen ? (
        <ListsModal
          type={modalType}
          onDismiss={closeModal}
          onConfirm={confirmModal}
        />
      ) : null}
      <SurroundPortals portalName={FAVORITES_LIST_ADD_BUTTON}>
        {appConfig.hasFavoritesLists ? (
          <RippleButton
            type="primary"
            className={styles.addButton}
            onClick={openAddModal}
            disabled={false}
          >
            {i18n.text('favorites.add_list')}
          </RippleButton>
        ) : null}
      </SurroundPortals>
    </div>
  );
};

FavoriteLists.propTypes = {
  addList: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  removeList: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired,
  isInitializing: PropTypes.bool,
  lists: PropTypes.arrayOf(PropTypes.shape()),
};

FavoriteLists.defaultProps = {
  lists: [],
  isInitializing: true,
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteLists);
