import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import AvailableText from '@shopgate/pwa-ui-shared/Availability';
import connect from './connector';
import styles from './style';

/**
 * The StockInfo component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const StockInfo = ({ stock }) => (
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
);

StockInfo.propTypes = {
  stock: PropTypes.shape(),
};

StockInfo.defaultProps = {
  stock: null,
};

export default connect(StockInfo);
