import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@shopgate/engage/components';
import { i18n, usePageSettings } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CouponFieldIcon from './components/CouponFieldIcon';

const { colors, variables } = themeConfig;

const easing = '450ms cubic-bezier(0.23, 1, 0.32, 1)';

const useStyles = makeStyles()({
  wrapper: {
    background: colors.light,
    padding: `${variables.gap.small}px ${variables.gap.big}px`,
  },
  wrapperCard: {
    background: colors.light,
    padding: `${variables.gap.small}px ${variables.gap.big}px`,
    margin: `${variables.gap.small * 1.5}px ${variables.gap.small * 1.5}px ${variables.gap.big}px`,
    border: `1px solid ${colors.shade7}`,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 2px rgba(0, 0, 0, 0.05)',
    borderRadius: 5,
  },
  container: {
    position: 'relative',
    width: '100%',
    fontSize: '0.875rem',
  },
  input: {
    '& .errorText': {
      position: 'inherit',
      whiteSpace: 'inherit',
    },
  },
  icon: {
    color: 'var(--color-primary)',
    fontSize: '1.875rem',
    position: 'absolute',
    transition: `opacity ${easing}`,
    cursor: 'pointer',
    top: 14,
    right: 0,
  },
});

/**
 * The Coupon Field Layout component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Layout = (props) => {
  const { classes } = useStyles();
  const { cartItemsDisplay = 'line' } = usePageSettings();

  return (
    <div className={cartItemsDisplay === 'line' ? classes.wrapper : classes.wrapperCard}>
      <form className={`${classes.container} theme__cart__coupon`} onSubmit={props.handleAddCoupon} data-test-id="couponField">
        <TextField
          disabled={props.isLoading}
          name="coupon-code-field"
          onFocusChange={props.handleFocusChange}
          onChange={props.handleValueChange}
          setRef={props.setInputRef}
          value={props.value}
          label="cart.redeem_coupon"
          errorText={props.error}
          className={classes.input}
        />

        <div
          data-test-id="CouponSubmitButton"
          style={props.iconStyle}
          className={classes.icon}
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
