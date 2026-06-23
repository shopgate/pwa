import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ProductListTypeProvider, ProductListEntryProvider } from '@shopgate/engage/product';
import { makeStyles } from '@shopgate/engage/styles';
import { Swiper } from '@shopgate/pwa-common/components';
import Item from './components/Item';
import connect from './connector';

const useStyles = makeStyles()({
  wrapper: {
    padding: '16px 0px 0px',
    '--swiper-pagination-bottom': '20px',
  },
});

/**
 * The LiveshoppingWidget component.
 * @param {Object} props Component props.
 * @param {Function} props.fetchProducts Loads widget products.
 * @param {Array<string>} props.products Product ids.
 * @returns {JSX.Element|null}
 */
export const LiveshoppingWidget = ({ fetchProducts, products }) => {
  const { classes } = useStyles();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!products.length) {
    return null;
  }

  if (products.length === 1) {
    return (
      <div className={classes.wrapper} data-test-id="liveShoppingWidget">
        <ProductListTypeProvider type="liveshopping" subType="widgets">
          {products.map(id => (
            <ProductListEntryProvider productId={id} key={id}>
              <Item productId={id} />
            </ProductListEntryProvider>
          ))}
        </ProductListTypeProvider>
      </div>
    );
  }

  return (
    <div className={classes.wrapper} data-test-id="liveShoppingWidget">
      <ProductListTypeProvider type="liveshopping" subType="widgets">
        <Swiper indicators loop={products.length > 1}>
          {products.map(id => (
            <Swiper.Item key={id}>
              <ProductListEntryProvider productId={id}>
                <Item productId={id} hasPagination />
              </ProductListEntryProvider>
            </Swiper.Item>
          ))}
        </Swiper>
      </ProductListTypeProvider>
    </div>
  );
};

LiveshoppingWidget.propTypes = {
  fetchProducts: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.string),
};

LiveshoppingWidget.defaultProps = {
  products: [],
};

export default connect(LiveshoppingWidget);
