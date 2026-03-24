import React, {
  useState, useEffect, useRef, useCallback, memo,
} from 'react';
import PropTypes from 'prop-types';
import { ProductList } from '@shopgate/engage/product/components';
import { ActionButton, I18n } from '@shopgate/engage/components';
import { transformDisplayOptions } from '@shopgate/engage/core/helpers';
import Headline from 'Components/Headline';
import ProductGrid from 'Components/ProductGrid';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './connector';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  listView: {
    background: colors.light,
    overflow: 'auto',
    '> ul > li:first-of-type': {
      paddingTop: 0,
    },
    '> ul > li:last-of-type': {
      paddingBottom: 0,
    },
  },
});

/**
 * The product widget component.
 * @param {Object} props Component props.
 * @returns {JSX.Element|null}
 */
const ProductsWidget = ({
  getProducts,
  hash,
  id,
  isFetching,
  products,
  settings,
  totalProductCount,
}) => {
  const { classes } = useStyles();
  const productList = products || [];
  const [productCount, setProductCount] = useState(() => productList.length);
  const prevProductsLenRef = useRef(productList.length);
  const prevHashRef = useRef(hash);
  const prevQueryParamsRef = useRef(JSON.stringify(settings.queryParams));

  const fetchProducts = useCallback((settingsOverride, init = false) => {
    const s = settingsOverride || settings;
    const offset = init ? 0 : productCount;

    getProducts(
      s.queryType,
      s.queryParams,
      {
        limit: s.productLimit,
        offset,
        sort: transformDisplayOptions(s.sortOrder),
      },
      id
    );
  }, [getProducts, id, productCount, settings]);

  useEffect(() => {
    if (productList.length === 0) {
      fetchProducts(null, true);
    }
    /* Mount-only initial fetch; mirrors legacy componentDidMount. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const len = productList.length;
    const total = totalProductCount;

    if (len !== prevProductsLenRef.current || len === total) {
      const capped = total != null ? Math.min(len, total) : len;
      setProductCount(capped);
    }
    prevProductsLenRef.current = len;
  }, [productList.length, totalProductCount]);

  useEffect(() => {
    const qp = JSON.stringify(settings.queryParams);
    const qpChanged = qp !== prevQueryParamsRef.current;
    const hashChanged = hash !== prevHashRef.current;
    const empty = productList.length === 0;

    if (hashChanged || (qpChanged && empty)) {
      fetchProducts(settings);
    }

    prevQueryParamsRef.current = qp;
    prevHashRef.current = hash;
  }, [hash, settings, settings.queryParams, productList.length, fetchProducts]);

  if (!productList.length) {
    return null;
  }

  const productSlice = productList.slice(0, productCount);
  const {
    headline,
    layout,
    showName,
    showPrice,
    showReviews,
  } = settings;

  const isList = layout === 'list';

  const flags = {
    name: isList ? true : showName,
    price: showPrice,
    reviews: showReviews,
    ...(isList && { manufacturer: false }),
  };

  const ProductComponent = isList ? ProductList : ProductGrid;

  const hasAllProducts = totalProductCount !== null && productList.length >= totalProductCount;

  const moreButton = settings.showLoadMore && !hasAllProducts ? (
    <ActionButton
      loading={isFetching}
      onClick={() => fetchProducts()}
    >
      <I18n.Text string="common.load_more" />
    </ActionButton>
  ) : null;

  return (
    <div {...(isList ? { className: classes.listView } : {})}>
      <Headline text={headline} />
      <ProductComponent
        flags={flags}
        infiniteLoad={false}
        products={productSlice}
        scope="widgets"
      />
      {moreButton}
    </div>
  );
};

ProductsWidget.propTypes = {
  getProducts: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  settings: PropTypes.shape().isRequired,
  hash: PropTypes.string,
  isFetching: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.shape()),
  totalProductCount: PropTypes.number,
};

ProductsWidget.defaultProps = {
  isFetching: null,
  products: null,
  totalProductCount: null,
  hash: null,
};

export default connect(memo(ProductsWidget));

export { ProductsWidget as UnwrappedProductsWidget };
