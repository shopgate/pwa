import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The Amount component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Amount = ({ isDisabled, amount, currency }) => (
  <div className={classNames(styles.amount, { [styles.disabled]: isDisabled })}>
    {typeof amount === 'string' && <I18n.Text string={amount} />}
    {typeof amount === 'number' && <I18n.Price price={amount} currency={currency} />}
  </div>
);

Amount.propTypes = {
  amount: PropTypes.arrayOf([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  currency: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default Amount;
