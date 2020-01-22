import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import styles from './style';

/**
 * The ShippingCostsLabel component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
function Label({ label, showSeparator, labelParams }) {
  if (!label) {
    return <div className={styles.label} />;
  }

  return (
    <div className={styles.label}>
      {`${i18n.text(label, labelParams)}${showSeparator ? ':' : ''}`}
    </div>
  );
}

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
