import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@shopgate/engage/components';
import { i18n, usePageSettings } from '@shopgate/engage/core';
import CouponFieldIcon from './components/CouponFieldIcon';
import styles from './style';

/**
 * The Coupon Field Layout component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Layout = (props) => {
  const { cartItemsDisplay = 'line' } = usePageSettings();

  return (
    <div className={cartItemsDisplay === 'line' ? styles.wrapper : styles.wrapperCard}>
      <form className={styles.container} onSubmit={props.handleAddCoupon} data-test-id="couponField">
        <TextField
          disabled={props.isLoading}
          name="coupon-code-field"
          onFocusChange={props.handleFocusChange}
          onChange={props.handleValueChange}
          setRef={props.setInputRef}
          value={props.value}
          label="cart.redeem_coupon"
          errorText={props.error}
          className={styles.input}
        />

        <div
          data-test-id="CouponSubmitButton"
          style={props.iconStyle}
          className={styles.icon}
          onKeyDown={props.handleAddCoupon}
          onClick={props.handleAddCoupon}
          role="button"
          aria-hidden={props.isButtonDisabled}
          tabIndex="0"
          aria-label={i18n.text('cart.submit_coupon')}
        >
          <CouponFieldIcon disabled={props.isButtonDisabled} />
        </div>

      </form>
    </div>
  );
};

Layout.propTypes = {
  error: PropTypes.string,
  handleAddCoupon: PropTypes.func,
  handleFocusChange: PropTypes.func,
  handleValueChange: PropTypes.func,
  iconStyle: PropTypes.shape(),
  isButtonDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  setInputRef: PropTypes.func,
  value: PropTypes.string,
};

Layout.defaultProps = {
  handleAddCoupon: () => { },
  handleFocusChange: () => { },
  handleValueChange: () => { },
  iconStyle: null,
  isButtonDisabled: false,
  isLoading: false,
  setInputRef: () => { },
  value: '',
  error: null,
};

export default Layout;
