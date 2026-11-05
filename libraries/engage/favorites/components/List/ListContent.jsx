import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import mapKeys from 'lodash/mapKeys';
import { makeStyles, useMediaQuery, useResponsiveValue } from '@shopgate/engage/styles';
import { getProductGridColumns } from '@shopgate/engage/settings/selectors/appSettings';
import { SCREEN_SIZE_BREAKPOINTS } from '@shopgate/engage/settings/constants/appSettings';
import { withWideScreenColumns } from '@shopgate/engage/product/components/ProductGrid/hooks';
import { i18n } from '@shopgate/engage/core/helpers';
import {
  ProductListTypeProvider,
  ProductProvider,
} from '@shopgate/engage/product/providers';
import { Button } from '@shopgate/engage/components/v2';
import { getUseGetFavoriteIdsPipeline } from '@shopgate/engage/favorites';
import ListItemWrapper from './ListItemWrapper';

const useStyles = makeStyles()((theme, { isAccordion, columns }) => ({
  divider: {
    height: 1,
    width: 'calc(100% + 32px)',
    ...(isAccordion && {
      backgroundColor: theme.components.separatorLine.borderColor,
    }),
    marginLeft: -16,
    marginRight: -16,
    marginBottom: 16,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: theme.spacing(2),
  },
  loadMoreButton: {
    width: 'calc(100% - 32px)',
    margin: '16px 16px 0 16px',
  },
}));

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
  isAccordion,
}) => {
  const gridColumns = useSelector(getProductGridColumns);
  const columns = useResponsiveValue(withWideScreenColumns(
    mapKeys(gridColumns, (_value, size) => SCREEN_SIZE_BREAKPOINTS[size])
  ));
  const { classes, cx } = useStyles({ isAccordion, columns });
  const isWide = useMediaQuery(theme => theme.breakpoints.up('md'));

  const listItems = (
    <>
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
              ) : null)}
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
    </>
  );

  return (
    <>
      <div className={classes.divider} />
      {items.length === 0 ? (
        <span>{i18n.text('favorites.empty')}</span>
      ) : null}
      <ProductListTypeProvider type="favoritesList">
        {isWide ? (
          <div className={cx(classes.grid, 'engage__favorites__grid')}>{listItems}</div>
        ) : listItems}
      </ProductListTypeProvider>
      {showLoadMoreButton &&
      <Button
        color="secondary"
        className={classes.loadMoreButton}
        onClick={onLoadMore}
      >
        {i18n.text('favorites.load_more_button')}
      </Button>}
    </>
  );
};

ListContent.propTypes = {
  addToCart: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  listId: PropTypes.string.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  showLoadMoreButton: PropTypes.bool.isRequired,
  useGetFavoriteIdsPipeline: PropTypes.bool.isRequired,
  isAccordion: PropTypes.bool,
};

ListContent.defaultProps = {
  isAccordion: false,
};

export default connect(mapStateToProps)(ListContent);
