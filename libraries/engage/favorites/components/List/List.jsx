import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showModal } from '@shopgate/engage/core/actions';
import {
  Accordion,
  Card,
  ConditionalWrapper,
} from '@shopgate/engage/components';
import {
  makeGetFavorites,
  getUseGetFavoriteIdsPipeline,
} from '@shopgate/pwa-common-commerce/favorites/selectors';
import { FAVORITES_SHOW_LIMIT } from '@shopgate/engage/favorites/constants';
import ListAccordionLabel from './ListAccordionLabel';
import ListContent from './ListContent';
import styles from './styles';

/**
 * @param {Object} _ State
 * @param {Object} props Props
 * @returns {Object}
 */
const makeMapStateToProps = (_, { id }) => {
  const getFavorites = makeGetFavorites(() => id);

  return state => ({
    items: getFavorites(state),
    useGetFavoriteIdsPipeline: getUseGetFavoriteIdsPipeline(state),
  });
};

/**
 * @param {Object} dispatch Dispatch
 * @param {Object} props The component props
 * @returns {Object}
 */
const mapDispatchToProps = (dispatch, props) => ({
  remove: async (id) => {
    // Protect list deletion with a confirmation modal
    const confirmed = await dispatch(showModal({
      message: 'favorites.delete_list_modal.message',
      title: 'favorites.delete_list_modal.title',
      params: {
        name: props.name,
      },
    }));

    if (confirmed) {
      props.remove(id);
    }
  },
});

/**
 * Favorite List component
 * @return {JSX}
 */
const FavoriteList = ({
  id,
  name,
  items,
  rename,
  remove,
  removeItem,
  addToCart,
  hasMultipleFavoritesListsSupport,
  useGetFavoriteIdsPipeline,
}) => {
  const [offset, setOffset] = useState(FAVORITES_SHOW_LIMIT);

  const filteredItems = useMemo(() => {
    /**
     * The getFavoriteIds pipeline doesn't return full products, but only product ids. Product data
     * is selected inside the ListContent component via the ProductProvider. To avoid requests with
     * huge response data, the favlist items are splitted into chunks, so that the ProductProvider
     * only has to request fresh data for each chunk.
     *
     * As long as not all products from the list are shown, a "Load More" button is presented to the
     * user, which will add an additional chunk of product ids to the ListContent component.
     */
    if (useGetFavoriteIdsPipeline) {
      return items.slice(0, offset);
    }

    // When the getFavorites pipeline is used, no special handling is necessary. "items" can passed
    // the the ListContent component as they are.
    return items;
  }, [items, offset, useGetFavoriteIdsPipeline]);

  const allFavoritesLoaded = useMemo(() => {
    if (useGetFavoriteIdsPipeline) {
      return items.length - filteredItems.length > 0;
    }
    /**
     * In case of getFavorites pipeline is used, and all favorites are always loaded, "false" as
     * return value might seem a bit weird, but the value is actually used to determine if the
     * load more button is supposed to be shown (not needed if all favorites are already present).
     */
    return false;
  }, [filteredItems.length, items.length, useGetFavoriteIdsPipeline]);

  const [
    showLoadMoreButton,
    setShowLoadMoreButton,
  ] = useState(allFavoritesLoaded);

  const handleLoadMore = useCallback(() => {
    setOffset(offset + FAVORITES_SHOW_LIMIT);
  }, [offset]);

  useEffect(() => {
    setShowLoadMoreButton(allFavoritesLoaded);
  }, [offset, allFavoritesLoaded]);

  return (
    <ConditionalWrapper
      condition={hasMultipleFavoritesListsSupport}
      wrapperFalsy={children => (
        <div className={styles.rootNoFavoritesLists}>
          {children}
        </div>
      )}
      wrapper={children => (
        <Card className={styles.root}>
          <Accordion
            className=""
            renderLabel={() =>
              <ListAccordionLabel
                id={id}
                title={name}
                rename={newName => rename(id, newName)}
                remove={remove}
              />
              }
            chevronPosition="left"
            startOpened
          >
            {children}
          </Accordion>
        </Card>
      )}
    >
      <ListContent
        listId={id}
        items={filteredItems}
        removeItem={removeItem}
        addToCart={addToCart}
        onLoadMore={handleLoadMore}
        showLoadMoreButton={showLoadMoreButton}
      />
    </ConditionalWrapper>
  );
};

FavoriteList.propTypes = {
  addToCart: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  name: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
  hasMultipleFavoritesListsSupport: PropTypes.bool,
  useGetFavoriteIdsPipeline: PropTypes.bool,
};

FavoriteList.defaultProps = {
  hasMultipleFavoritesListsSupport: false,
  useGetFavoriteIdsPipeline: false,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(FavoriteList);
