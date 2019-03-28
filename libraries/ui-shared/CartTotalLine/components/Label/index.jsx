import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The ShippingCostsLabel component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const Label = ({
  isDisabled, label, showSeparator, type,
}) => (
  <div className={`${styles.label} ${isDisabled ? styles.disabled : ''}`} data-test-id={`${type}Label`}>
    <I18n.Text string={label} />
    {showSeparator && ':'}
  </div>
);

Label.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  showSeparator: PropTypes.bool,
  type: PropTypes.string,
};

Label.defaultProps = {
  showSeparator: true,
  type: '',
};

export default Label;
