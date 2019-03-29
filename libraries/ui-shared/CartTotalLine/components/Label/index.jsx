import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The ShippingCostsLabel component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const Label = ({ label, showSeparator, labelParams }) => (
  <div className={styles.label}>
    {label && <I18n.Text string={label} params={labelParams} />}
    {label && showSeparator && ':'}
  </div>
);

Label.propTypes = {
  label: PropTypes.string,
  labelParams: PropTypes.shape(),
  showSeparator: PropTypes.bool,
};

Label.defaultProps = {
  label: null,
  showSeparator: true,
  labelParams: {},
};

export default Label;
