import React, { PropTypes } from 'react';
import { CrossIcon } from 'Templates/components/icons';
import styles from '../style';

/**
 * The CouponDelete component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const CouponDelete = props => (
  <button className={styles.closeIcon} onClick={props.handleDelete}>
    <CrossIcon />
  </button>
);

CouponDelete.propTypes = {
  handleDelete: PropTypes.func,
};

CouponDelete.defaultProps = {
  handleDelete: () => {},
};

export default CouponDelete;

