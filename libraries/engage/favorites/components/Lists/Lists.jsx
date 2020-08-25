import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import { RippleButton, SurroundPortals } from '@shopgate/engage/components';
import { i18n, configuration, IS_CONNECT_EXTENSION_ATTACHED } from '@shopgate/engage/core';
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
import { getWishlistMode } from '@shopgate/engage/core/selectors/shopSettings';
import { WISHLIST_MODE_PERSIST_ON_ADD } from '@shopgate/engage/core/constants/shopSettings';
import { getPreferredLocation, getPreferredFulfillmentMethod, getUserSearch } from '@shopgate/engage/locations/selectors';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { makeGetEnabledFulfillmentMethods } from '@shopgate/engage/core/config';
import { fetchProductLocations } from '@shopgate/engage/locations/actions';

import List from '../List';
import ListsModal from './ListsModal';
import ItemFulfillmentMethod from '../ItemFulfillmentMethod';
import {
  FAVORITES_LIST_ADD_BUTTON,
  FAVORITES_LIST,
} from '../../constants/Portals';

/**
 * @param {Object} state State
 * @param {Object} props Props
 * @returns {Object}
 */
const makeMapStateToProps = () => {
  const getFulfillmentMethods = makeGetEnabledFulfillmentMethods();
  return (state, props) => ({
    isInitializing: isInitialLoading(state),
    lists: getFavoritesLists(state),
    preferredLocation: getPreferredLocation(state, props),
    preferredFulfillmentMethod: getPreferredFulfillmentMethod(state, props),
    shopFulfillmentMethods: getFulfillmentMethods(state, props),
    wishlistMode: getWishlistMode(state),
    userSearch: getUserSearch(state),
  });
};

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
  fetchLocations: (productId, params) => dispatch(fetchProductLocations(productId, params)),
});

const styles = {
  root: css({
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      margin: 8,
    },
  }),
  addButton: css({
    width: 'calc(100% - 32px)',
    margin: 16,
    backgroundColor: 'var(--color-primary)',
    borderRadius: 5,
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      width: 240,
      float: 'right',
    },
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
  shopFulfillmentMethods,
  userSearch,
  fetchLocations,
}) => {
  const hasConnectExtension = !!configuration.get(IS_CONNECT_EXTENSION_ATTACHED);

  // Add to cart state.
  const promiseRef = useRef(null);
  const [activeProductId, setActiveProductId] = useState(null);
  const [fulfillmentMethods, setFulfillmentMethods] = useState([]);
  const [fulfillmentMethod, setFulfillmentMethod] = useState(null);
  const [foMethodChooser, setFOMethodChooser] = useState(false);

  const handleAddToCartWithMethod = useCallback((method) => {
    // Hide modal if visible.
    setFOMethodChooser(false);

    // Handle cancellation.
    if (!method) {
      return;
    }

    setFulfillmentMethod(method);

    // Direct ship.
    if (method === 'directShip') {
      addToCart([{
        productId: activeProductId,
        quantity: 1,
      }]);
      promiseRef.current.resolve();
      return;
    }

    // Open the sheet
    fetchLocations(activeProductId, userSearch);
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
  }, [activeProductId, addToCart, fetchLocations, userSearch]);

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

    // Get location.
    let activeLocation = null;
    if (preferredLocation) {
      activeLocation = preferredLocation;
    }

    // Get fulfillment method that is both active for location and product.
    let activeFulfillmentMethod = preferredFulfillmentMethod || fulfillmentMethod;
    const availableFulfillmentMethods = shopFulfillmentMethods?.filter(
      s => product.fulfillmentMethods.indexOf(s) !== -1
    ) || [];
    if (activeLocation && !activeFulfillmentMethod && availableFulfillmentMethods.length === 1) {
      [activeFulfillmentMethod] = availableFulfillmentMethods;
    }

    // If all options are already configured immediately add it to the cart.
    if (activeFulfillmentMethod && activeLocation) {
      addToCart([{
        productId: product.id,
        quantity: 1,
        fulfillment: {
          method: activeFulfillmentMethod,
          location: {
            code: activeLocation.code,
            name: activeLocation.name || '',
          },
        },
      }]);
      promiseRef.current.resolve();
      return promise;
    }

    // Location not set but FO method is set.
    setActiveProductId(product.id);
    if (activeFulfillmentMethod && !activeLocation) {
      handleAddToCartWithMethod(activeFulfillmentMethod);
      return promise;
    } if (!activeFulfillmentMethod && !activeFulfillmentMethod) {
      // Long path is required <- fo method and location unset.
      setFulfillmentMethods(shopFulfillmentMethods);
      setFOMethodChooser(true);
      return promise;
    }
    // Short path is required <- fo method is unset.
    setFulfillmentMethods(availableFulfillmentMethods);
    setFOMethodChooser(true);
    return promise;
  }, [
    addToCart,
    fulfillmentMethod,
    handleAddToCartWithMethod,
    preferredFulfillmentMethod,
    preferredLocation,
    removeItem,
    shopFulfillmentMethods,
    wishlistMode,
  ]);

  const handleMethodClose = useCallback(() => {
    setFOMethodChooser(false);
    promiseRef.current.reject();
  }, []);

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
      {activeProductId ? (
        <FulfillmentSheet
          productId={activeProductId}
          fulfillmentMethod={fulfillmentMethod}
        />
      ) : null}
      <ItemFulfillmentMethod
        isOpen={foMethodChooser}
        methods={fulfillmentMethods}
        onSelect={handleAddToCartWithMethod}
        onClose={handleMethodClose}
      />
      <SurroundPortals portalName={FAVORITES_LIST_ADD_BUTTON}>
        {hasConnectExtension ? (
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
  fetchLocations: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  removeList: PropTypes.func.isRequired,
  shopFulfillmentMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateList: PropTypes.func.isRequired,
  wishlistMode: PropTypes.string.isRequired,
  isInitializing: PropTypes.bool,
  lists: PropTypes.arrayOf(PropTypes.shape()),
  preferredFulfillmentMethod: PropTypes.string,
  preferredLocation: PropTypes.shape(),
  userSearch: PropTypes.shape(),
};

FavoriteLists.defaultProps = {
  lists: [],
  userSearch: {},
  preferredFulfillmentMethod: null,
  preferredLocation: null,
  isInitializing: true,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(FavoriteLists);
