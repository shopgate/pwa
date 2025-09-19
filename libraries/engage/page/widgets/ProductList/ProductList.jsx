import React from 'react';
import { ActionButton, I18n } from '@shopgate/engage/components';
import { ProductGrid } from '@shopgate/engage/product/components';
import { useWidgetProducts } from '@shopgate/engage/page/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import { useProductListWidget } from './hooks';
import WidgetHeadline from '../../components/WidgetHeadline';

const useStyles = makeStyles()({
  root: {
    // Prevent that the ActionButton margin messes with the layout of the sibling widgets
    overflow: 'hidden',
  },
  grid: {
    '&&': {
      marginTop: 0,
    },
  },
});

/**
 * The ProductListWidget is used to display product lists.
 * @returns {JSX.Element}
 */
const ProductListWidget = () => {
  const { classes } = useStyles();

  const {
    productsSearchType,
    productsSearchValue,
    sort,
    productCount,
    showLoadMore,
    flags,
    showHeadline,
    headline,
  } = useProductListWidget();

  const {
    fetchNext, hasNext, isFetching, results,
  } = useWidgetProducts({
    type: productsSearchType,
    value: productsSearchValue,
    limit: productCount,
    sort,
  });

  return (
    <div className={classes.root}>
      {(showHeadline && headline && results.length) ? (
        <WidgetHeadline headline={headline} />
      ) : null}
      <ProductGrid
        products={results}
        flags={flags}
        scope="widgets"
        infiniteLoad={false}
        className={classes.grid}
      />
      { hasNext && showLoadMore && (
        <ActionButton
          loading={isFetching}
          onClick={fetchNext}
        >
          <I18n.Text string="common.load_more" />
        </ActionButton>
      )}
    </div>
  );
};

export default ProductListWidget;
