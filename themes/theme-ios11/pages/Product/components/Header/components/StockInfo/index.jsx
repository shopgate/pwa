import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { PlaceholderLabel } from '@shopgate/engage/components';
import { AvailableText } from '@shopgate/engage/components';
import { Portal } from '@shopgate/engage/components';
import * as portals from '@shopgate/engage/product';
import connect from './connector';
import styles from './style';

/**
 * The StockInfo component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const StockInfo = ({ stock }) => (
  <Fragment>
    <Portal name={portals.PRODUCT_STOCK_INFO_BEFORE} />
    <Portal name={portals.PRODUCT_STOCK_INFO}>
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
    <Portal name={portals.PRODUCT_STOCK_INFO_AFTER} />
  </Fragment>
);

StockInfo.propTypes = {
  stock: PropTypes.shape(),
};

StockInfo.defaultProps = {
  stock: null,
};

export default connect(StockInfo);
