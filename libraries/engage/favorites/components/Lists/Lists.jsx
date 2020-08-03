import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import { RippleButton } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import {
  getFavoritesLists,
  isInitialLoading,
} from '@shopgate/pwa-common-commerce/favorites/selectors';
import addFavoritesList from '@shopgate/pwa-common-commerce/favorites/actions/addFavoritesList';
import updateFavoritesList from '@shopgate/pwa-common-commerce/favorites/actions/updateFavoritesList';
import removeFavoritesList from '@shopgate/pwa-common-commerce/favorites/actions/removeFavoritesList';
import { removeFavorites } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import List from '../List';
import ListsModal from './ListsModal';

/**
 * @param {Object} state State
 * @returns {Object}
 */
const mapStateToProps = state => ({
  isInitializing: isInitialLoading(state),
  lists: getFavoritesLists(state),
});
/**
 * @param {Object} dispatch Dispatch
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  addList: name => dispatch(addFavoritesList(name)),
  updateList: (code, name) => dispatch(updateFavoritesList(code, name)),
  removeList: code => dispatch(removeFavoritesList(code)),
  removeItem: (listId, productId) => dispatch(removeFavorites(productId, false, listId)),
});

const styles = {
  addButton: css({
    width: 'calc(100% - 32px)',
    margin: 16,
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
    <div>
      {lists.map(list => (
        <List
          key={list.code}
          code={list.code}
          name={list.name}
          rename={openRenameModal}
          remove={() => removeList(list.code)}
          removeItem={productId => removeItem(list.code, productId)}
        />
      ))}
      {modalOpen ? (
        <ListsModal
          type={modalType}
          onDismiss={closeModal}
          onConfirm={confirmModal}
        />
      ) : null}
      <RippleButton
        type="primary"
        className={styles.addButton}
        onClick={openAddModal}
        disabled={false}
      >
        {i18n.text('favorites.add_list')}
      </RippleButton>
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
