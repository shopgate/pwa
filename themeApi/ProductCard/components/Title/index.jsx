import React from 'react';
import PropTypes from 'prop-types';
import { Ellipsis } from '@shopgate/pwa-common/components';
import styles from './style';

/**
 * @returns {JSX}
 */
function ProductCardTitle({ title, rows, style }) {
  return (
    <div className={styles} style={style} data-test-id={`Productname: ${title}`}>
      <Ellipsis rows={rows}><span dangerouslySetInnerHTML={{ __html: title }} /></Ellipsis>
    </div>
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
