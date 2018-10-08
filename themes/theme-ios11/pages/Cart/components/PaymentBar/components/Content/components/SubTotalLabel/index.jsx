import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import connect from './connector';
import styles from './style';

/**
 * The SubTotalLabel component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const SubTotalLabel = ({ isDisabled }) => (
  <div className={`${styles.totalLabel} ${isDisabled ? styles.disabled : ''}`}>
    <I18n.Text string="cart.subtotal" />:
  </div>
);

SubTotalLabel.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
};

export default connect(SubTotalLabel);
