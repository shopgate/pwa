import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import AvailableText from '@shopgate/pwa-ui-shared/Availability';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()({
  placeholder: {
    height: 16,
    width: '70%',
    marginTop: 5,
    marginBottom: 2,
  },
  availability: {
    fontSize: '0.875rem',
  },
});

/**
 * The StockInfo component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const StockInfo = ({ stock }) => {
  const { classes } = useStyles();

  return (
    <>
      <Portal name={portals.PRODUCT_STOCK_INFO_BEFORE} />
      <Portal name={portals.PRODUCT_STOCK_INFO}>
        <PlaceholderLabel className={classes.placeholder} ready={(stock !== null)}>
          {stock && (
            <AvailableText
              className={classes.availability}
              showWhenAvailable={false}
              text={stock.text}
              state={stock.state}
            />
          )}
        </PlaceholderLabel>
      </Portal>
      <Portal name={portals.PRODUCT_STOCK_INFO_AFTER} />
    </>
  );
};

StockInfo.propTypes = {
  stock: PropTypes.shape(),
};

StockInfo.defaultProps = {
  stock: null,
};

export default connect(StockInfo);
