import React, { useCallback } from 'react';
import { I18n } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { ProductGrid } from '@shopgate/engage/product/components';
import { useWidgetProducts } from '@shopgate/engage/page/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import { useProductListWidget } from './hooks';
import WidgetHeadline from '../../components/WidgetHeadline';

const useStyles = makeStyles()(theme => ({
  root: {
    // Prevent that the load more button margin messes with the layout of the sibling widgets
    overflow: 'hidden',
  },
  loadMore: {
    textAlign: 'center',
    margin: theme.spacing(1, 0),
  },
  grid: {
    '&&': {
      marginTop: 0,
    },
  },
}));

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
    isPreview,
  } = useProductListWidget();

  const {
    fetchNext, hasNext, isFetching, results,
  } = useWidgetProducts({
    type: productsSearchType,
    value: productsSearchValue,
    limit: productCount,
    sort,
  });

  const handleFetchNext = useCallback((e) => {
    if (isPreview) {
      // Prevent unintended scroll effects when load more is clicked in preview.
      e.stopPropagation();
    }
    fetchNext();
  }, [fetchNext, isPreview]);

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
        <div className={classes.loadMore}>
          <Button
            variant="text"
            color="secondary"
            loading={isFetching}
            onClick={handleFetchNext}
          >
            <I18n.Text string="common.load_more" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductListWidget;
