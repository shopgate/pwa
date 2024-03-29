import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import { RippleButton, SurroundPortals } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import {
  getFavoritesLists,
  isInitialLoading,
  getHasMultipleFavoritesListsSupport,
  addFavoritesList,
  updateFavoritesList,
  removeFavoritesList,
  removeFavorites,
} from '@shopgate/engage/favorites';
import { addProductsToCart } from '@shopgate/engage/cart';

import List from '../List';
import ListsModal from './ListsModal';
import {
  FAVORITES_LIST_ADD_BUTTON,
  FAVORITES_LIST,
} from '../../constants/Portals';

/**
 * TODO
 *
 * This constant originally comes from PWA 7 shopSettings. If another mode is requested in the
 * future, this needs to be set dynamically.
 */
const WISHLIST_MODE_PERSIST_ON_ADD = 'persistOnAdd';

/**
 * @param {Object} state State
 * @param {Object} props Props
 * @returns {Object}
 */
const mapStateToProps = state => ({
  isInitializing: isInitialLoading(state),
  lists: getFavoritesLists(state),
  wishlistMode: WISHLIST_MODE_PERSIST_ON_ADD,
  hasMultipleFavoritesListsSupport: getHasMultipleFavoritesListsSupport(state),
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
  addToCart,
  wishlistMode,
  lists,
  isInitializing,
  hasMultipleFavoritesListsSupport,
}) => {
  // Add to cart state.
  const promiseRef = useRef(null);

  const handleAddToCart = useCallback((listId, product) => {
    // Create promise to inform add to cart button when ready.
    const promise = new Promise((resolve, reject) => {
      promiseRef.current = {
        resolve: () => {
          // Remove item from wishlist after adding to cart.
          if (wishlistMode !== WISHLIST_MODE_PERSIST_ON_ADD) {
            removeItem(listId, product.id);
          }
          resolve();
        },
        reject,
      };
    });

    // If all options are already configured immediately add it to the cart.
    addToCart([{
      productId: product.id,
      quantity: 1,
    }]);
    promiseRef.current.resolve();
    return promise;
  }, [
    addToCart,
    removeItem,
    wishlistMode,
  ]);

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
            addToCart={product => handleAddToCart(list.id, product)}
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
        {hasMultipleFavoritesListsSupport ? (
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
  addToCart: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  removeList: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired,
  wishlistMode: PropTypes.string.isRequired,
  hasMultipleFavoritesListsSupport: PropTypes.bool,
  isInitializing: PropTypes.bool,
  lists: PropTypes.arrayOf(PropTypes.shape()),
};

FavoriteLists.defaultProps = {
  lists: [],
  isInitializing: true,
  hasMultipleFavoritesListsSupport: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteLists);
