import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { i18n } from '@shopgate/engage/core/helpers';
import {
  ProductListTypeProvider,
  ProductProvider,
} from '@shopgate/engage/product/providers';
import {
  RippleButton,
} from '@shopgate/engage/components';
import { getUseGetFavoriteIdsPipeline } from '@shopgate/engage/favorites';
import ListItemWrapper from './ListItemWrapper';
import styles from './styles';

/**
 * @param {Object} state State
 * @param {Object} props Props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  useGetFavoriteIdsPipeline: getUseGetFavoriteIdsPipeline(state, props),
});

/**
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const ListContent = ({
  listId,
  items,
  removeItem,
  addToCart,
  useGetFavoriteIdsPipeline,
  showLoadMoreButton,
  onLoadMore,
}) => (
  <>
    <div className={styles.divider} />
    {items.length === 0 ? (
      <span>{i18n.text('favorites.empty')}</span>
    ) : null}
    <ProductListTypeProvider type="favoritesList">
      {/** The getFavoriteIds pipeline doesn't return full products, but only product ids. The
      ProductProvider requests missing products and provides it to the ListItemWrapper */}
      { useGetFavoriteIdsPipeline
        ? (items.map(({ productId }, index) => (
          <ProductProvider productId={productId} key={productId}>
            {({ product }) => (
              product ? (
                <ListItemWrapper
                  listId={listId}
                  product={product}
                  items={items}
                  addToCart={addToCart}
                  removeItem={removeItem}
                  index={index}
                  key={product.id}
                />
              ) : null)
            }
          </ProductProvider>
        ))) : null}
      {!useGetFavoriteIdsPipeline &&
          items
            .filter(({ product }) => product)
            .map(({ product, notes, quantity }, index) => (
              <ListItemWrapper
                listId={listId}
                product={product}
                notes={notes}
                quantity={quantity}
                items={items}
                addToCart={addToCart}
                removeItem={removeItem}
                index={index}
                key={product.id}
              />
            ))}
    </ProductListTypeProvider>
    {showLoadMoreButton &&
      <RippleButton
        type="primary"
        className={styles.loadMoreButton}
        onClick={onLoadMore}
      >
        {i18n.text('favorites.load_more_button')}
      </RippleButton>
    }
  </>
);

ListContent.propTypes = {
  addToCart: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  listId: PropTypes.string.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  showLoadMoreButton: PropTypes.bool.isRequired,
  useGetFavoriteIdsPipeline: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(ListContent);
