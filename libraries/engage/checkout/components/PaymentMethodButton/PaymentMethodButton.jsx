import React from 'react';
import PropTypes from 'prop-types';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { css } from 'glamor';

const styles = {
  root: css({
    outline: 'none',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: 4,
    background: '#fff',
    height: 52,
    width: 160,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [responsiveMediaQuery('xs')]: {
      width: '50%',
    },
    '&:not(:last-child)': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    '&:not(:first-child)': {
      borderLeft: 'none',
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.05)',
    },
  }).toString(),
  active: css({
    background: 'rgba(0, 0, 0, 0.12)',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.12)',
    },
  }).toString(),
};

/**
 * Payment Button
 * @param {Object} props Props
 * @returns {JSX}
 */
const PaymentMethodButton = ({ children, active, onChange }) => (
  <button
    type="button"
    className={`${styles.root} ${active && styles.active}`}
    onClick={() => onChange()}
  >
    {children}
  </button>
);

PaymentMethodButton.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PaymentMethodButton;
