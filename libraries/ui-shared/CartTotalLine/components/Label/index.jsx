import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The ShippingCostsLabel component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const Label = ({ label, showSeparator }) => {
  if (label === null) {
    return null;
  }

  return (
    <div className={styles.label}>
      <I18n.Text string={label} />
      {showSeparator && ':'}
    </div>
  );
};

Label.propTypes = {
  label: PropTypes.string.isRequired,
  showSeparator: PropTypes.bool,
};

Label.defaultProps = {
  showSeparator: true,
};

export default Label;
