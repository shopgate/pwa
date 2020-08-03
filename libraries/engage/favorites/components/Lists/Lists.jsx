import React, { useState, useCallback, useRef } from 'react';
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
import addProductsToCart from '@shopgate/pwa-common-commerce/cart/actions/addProductsToCart';
import { FulfillmentSheet, MULTI_LINE_RESERVE, STAGE_SELECT_STORE } from '@shopgate/engage/locations';
import { openSheet } from '@shopgate/engage/locations/providers/FulfillmentProvider';
import { getIsLocationBasedShopping } from '@shopgate/engage/core/selectors/merchantSettings';
import { getWishlistMode } from '@shopgate/engage/core/selectors/shopSettings';
import { WISHLIST_MODE_PERSIST_ON_ADD } from '@shopgate/engage/core/constants/shopSettings';
import { getPreferredLocation, getPreferredFulfillmentMethod } from '@shopgate/engage/locations/selectors';
import List from '../List';
import ListsModal from './ListsModal';
import ItemFulfillmentMethod from '../ItemFulfillmentMethod';

/**
 * @param {Object} state State
 * @returns {Object}
 */
const mapStateToProps = state => ({
  isInitializing: isInitialLoading(state),
  lists: getFavoritesLists(state),
  isLocationBasedShopping: getIsLocationBasedShopping(state),
  preferredLocation: getPreferredLocation(state),
  preferredFulfillmentMethod: getPreferredFulfillmentMethod(state),
  wishlistMode: getWishlistMode(state),
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
  addToCart: (...params) => dispatch(addProductsToCart(...params)),
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
  addToCart,
  preferredFulfillmentMethod,
  preferredLocation,
  wishlistMode,
  lists,
  isInitializing,
  isLocationBasedShopping,
}) => {
  // Add to cart state.
  const promiseRef = useRef(null);
  const [activeProductId, setActiveProductId] = useState(null);
  const [fulfillmentMethods, setFulfillmentMethods] = useState([]);
  const [fulfillmentMethod, setFulfillmentMethod] = useState(null);
  const [foMethodChooser, setFOMethodChooser] = useState(false);

  const handleAddToCartWithMethod = useCallback((method) => {
    // Hide modal if visible.
    setFOMethodChooser(false);
    setFulfillmentMethod(method);

    // Handle cancellation.
    if (!method) {
      return;
    }

    // Open the sheet
    setTimeout(() => {
      openSheet({
        callback: (state) => {
          if (state) {
            return promiseRef.current?.resolve();
          }

          return promiseRef.current?.reject();
        },
        fulfillmentPath: MULTI_LINE_RESERVE,
        stage: STAGE_SELECT_STORE,
      });
    }, 10);
  }, []);
  const handleAddToCart = useCallback((listId, product) => {
    // Create promise to inform add to cart button when ready.
    const promise = new Promise((resolve, reject) => {
      promiseRef.current = {
        resolve: () => {
          // Remove item from wishlist after adding to cart.
          if (wishlistMode === WISHLIST_MODE_PERSIST_ON_ADD) {
            removeItem(listId, product.id);
          }
          resolve();
        },
        reject,
      };
    });

    // Location based shopping.
    if (isLocationBasedShopping && preferredLocation && preferredFulfillmentMethod) {
      addToCart([{
        productId: product.id,
        quantity: 1,
        fulfillment: {
          method: preferredFulfillmentMethod,
          location: {
            code: preferredLocation.code,
            name: preferredLocation.name || '',
          },
        },
      }]);
      promiseRef.current.resolve();
      return promise;
    }

    // Quick path -> only one FO method available.
    setActiveProductId(product.id);
    const methods = product.fulfillmentMethods;
    if (methods.length === 1) {
      handleAddToCartWithMethod(methods[0]);
      return promise;
    }

    // Long path -> Select FO method first.
    setFulfillmentMethods(methods);
    setFOMethodChooser(true);
    return promise;
  }, [
    addToCart,
    handleAddToCartWithMethod,
    isLocationBasedShopping,
    preferredFulfillmentMethod,
    preferredLocation,
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
    <div>
      {lists.map(list => (
        <List
          key={list.code}
          code={list.code}
          name={list.name}
          rename={openRenameModal}
          remove={() => removeList(list.code)}
          removeItem={productId => removeItem(list.code, productId)}
          addToCart={product => handleAddToCart(list.code, product)}
        />
      ))}
      {modalOpen ? (
        <ListsModal
          type={modalType}
          onDismiss={closeModal}
          onConfirm={confirmModal}
        />
      ) : null}
      {activeProductId ? (
        <FulfillmentSheet
          productId={activeProductId}
          fulfillmentMethod={fulfillmentMethod}
        />
      ) : null}
      <ItemFulfillmentMethod
        isOpen={foMethodChooser}
        methods={fulfillmentMethods}
        onClose={handleAddToCartWithMethod}
      />
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
  addToCart: PropTypes.func.isRequired,
  isLocationBasedShopping: PropTypes.bool.isRequired,
  removeItem: PropTypes.func.isRequired,
  removeList: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired,
  wishlistMode: PropTypes.string.isRequired,
  isInitializing: PropTypes.bool,
  lists: PropTypes.arrayOf(PropTypes.shape()),
  preferredFulfillmentMethod: PropTypes.string,
  preferredLocation: PropTypes.shape(),
};

FavoriteLists.defaultProps = {
  lists: [],
  preferredFulfillmentMethod: null,
  preferredLocation: null,
  isInitializing: true,
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteLists);
