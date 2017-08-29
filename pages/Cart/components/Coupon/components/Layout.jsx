import React, { PropTypes } from 'react';
import { Grid } from 'Library/components';
import CouponIcon from './Icon';
import CouponPrice from './Price';
import CouponTitle from './Title';
import CouponCode from './Code';
import CouponDelete from './Delete';
import styles from '../style';

/**
 * The CouponLayout component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const CouponLayout = props => (
  <Grid className={styles.item}>
    <Grid.Item className={styles.icon}>
      <CouponIcon />
    </Grid.Item>
    <Grid.Item className={styles.content} grow={1}>
      <CouponTitle value={props.coupon.label} />
      <CouponCode value={props.coupon.code} />
    </Grid.Item>
    <Grid.Item className={`${styles.content} ${styles.contentLast}`} grow={1} shrink={0}>
      <CouponDelete handleDelete={props.handleDelete} />
      <CouponPrice
        currency={props.currency}
        savedPrice={props.coupon.savedPrice}
      />
    </Grid.Item>
  </Grid>
);

CouponLayout.propTypes = {
  coupon: PropTypes.shape().isRequired,
  currency: PropTypes.string.isRequired,
  handleDelete: PropTypes.func,

};

CouponLayout.defaultProps = {
  handleDelete: () => {},
};

export default CouponLayout;
