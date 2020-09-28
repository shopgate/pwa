import React from 'react';
import PropTypes from 'prop-types';
import { ProductName } from '@shopgate/engage/product';
import styles from './style';

/**
 * @returns {JSX}
 */
function ProductCardTitle({ title, rows, style }) {
  return (
    <ProductName
      name={title}
      className={styles}
      style={style}
      testId={`Productname: ${title}`}
      rows={rows}
    />
  );
}

ProductCardTitle.propTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.number,
  style: PropTypes.shape(),
};

ProductCardTitle.defaultProps = {
  rows: 2,
  style: {},
};

export default ProductCardTitle;
