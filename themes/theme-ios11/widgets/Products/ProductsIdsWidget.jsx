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
 * Product widget that loads by explicit product ids (query type 4).
 * @param {Object} props Component props.
 * @returns {JSX.Element|null}
 */
const ProductsIdsWidget = ({
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
  const { productLimit } = settings;
  const [productCount, setProductCount] = useState(productLimit);

  const prevHashRef = useRef(hash);
  const prevQueryParamsRef = useRef(JSON.stringify(settings.queryParams));
  const propsSignatureRef = useRef('');

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
    fetchProducts(null, true);
    /* Always fetch on mount (legacy ProductsIdsWidget componentDidMount). */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sig = [
      hash,
      productList.length,
      totalProductCount,
      JSON.stringify(settings.queryParams),
      settings.productLimit,
    ].join('|');

    if (propsSignatureRef.current !== sig) {
      propsSignatureRef.current = sig;
      setProductCount(settings.productLimit);
    }
  }, [
    hash,
    productList.length,
    settings,
    settings.productLimit,
    settings.queryParams,
    totalProductCount,
  ]);

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

  const hasAllProducts = productCount >= productList.length;

  /**
   * Reveals more products from the already-loaded list (no extra request).
   */
  const handleLoadMore = () => {
    if (hasAllProducts) {
      return;
    }
    setProductCount(c => c + settings.productLimit);
  };

  const moreButton = settings.showLoadMore && !hasAllProducts ? (
    <ActionButton
      loading={isFetching}
      onClick={handleLoadMore}
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

ProductsIdsWidget.propTypes = {
  getProducts: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  settings: PropTypes.shape().isRequired,
  hash: PropTypes.string,
  isFetching: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.shape()),
  totalProductCount: PropTypes.number,
};

ProductsIdsWidget.defaultProps = {
  isFetching: null,
  products: null,
  totalProductCount: null,
  hash: null,
};

export default connect(memo(ProductsIdsWidget));
