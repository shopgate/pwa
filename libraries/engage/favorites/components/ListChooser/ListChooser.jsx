import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getFavoritesListState,
  getFavoritesLists,
} from '@shopgate/pwa-common-commerce/favorites/selectors';
import { i18n } from '@shopgate/engage/core';
import { SheetList, SheetDrawer } from '@shopgate/engage/components';
import { closeFavoritesListChooser } from '@shopgate/pwa-common-commerce/favorites/action-creators';
import { toggleFavorite } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import ListChooserItem from './ListChooserItem';

/**
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  settings: getFavoritesListState(state).chooser,
  lists: getFavoritesLists(state),
});

/**
 * @param {Object} dispatch Dispatch.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  close: () => dispatch(closeFavoritesListChooser()),
  toggle: (...params) => dispatch(toggleFavorite(...params)),
});

/**
 * @param {Object} props Props.
 * @returns {JSX}
 */
const ListChooser = ({
  settings, lists, close, toggle,
}) => {
  const isVisible = !!settings;
  const productId = settings?.productId;
  const withRelatives = settings?.withRelatives;

  return (
    <SheetDrawer
      isOpen={isVisible}
      title={i18n.text('favorites.list_chooser.title')}
      onDidClose={close}
    >
      <SheetList>
        {lists.map(list => (
          <SheetList.Item
            key={list.code}
            title={list.name}
            onClick={() => {
              close();
              toggle(productId, list.code, withRelatives);
            }}
            rightComponent={
              <ListChooserItem
                listId={list.code}
                productId={productId}
              />
            }
          />
        ))}
      </SheetList>
    </SheetDrawer>
  );
};

ListChooser.propTypes = {
  close: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  lists: PropTypes.arrayOf(PropTypes.shape()),
  settings: PropTypes.shape(),
};

ListChooser.defaultProps = {
  settings: null,
  lists: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(ListChooser);
