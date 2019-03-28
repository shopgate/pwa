import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The ShippingCostsLabel component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const Hint = ({ isDisabled, hint }) => (
  <div className={classNames(styles.amount, { [styles.disabled]: isDisabled })}>
    <I18n.Text string={hint} />
  </div>
);

Hint.propTypes = {
  hint: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default Hint;
