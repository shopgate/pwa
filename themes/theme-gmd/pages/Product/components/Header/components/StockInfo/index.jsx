import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  PlaceholderLabel,
  Availability as AvailableText,
  Portal,
} from '@shopgate/engage/components';
import {
  PRODUCT_STOCK_INFO_BEFORE,
  PRODUCT_STOCK_INFO,
  PRODUCT_STOCK_INFO_AFTER,
} from '@shopgate/engage/product';
import connect from './connector';
import styles from './style';

/**
 * The StockInfo component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const StockInfo = ({ stock }) => (
  <Fragment>
    <Portal name={PRODUCT_STOCK_INFO_BEFORE} />
    <Portal name={PRODUCT_STOCK_INFO}>
      <PlaceholderLabel className={styles.placeholder} ready={(stock !== null)}>
        {stock && (
          <AvailableText
            className={styles.availability}
            showWhenAvailable={false}
            text={stock.text}
            state={stock.state}
          />
        )}
      </PlaceholderLabel>
    </Portal>
    <Portal name={PRODUCT_STOCK_INFO_AFTER} />
  </Fragment>
);

StockInfo.propTypes = {
  stock: PropTypes.shape(),
};

StockInfo.defaultProps = {
  stock: null,
};

export default connect(StockInfo);
