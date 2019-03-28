import React from 'react';
import PropTypes from 'prop-types';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import styles from './style';

/**
 * The TaxLabel component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const TaxLabel = ({ isDisabled, label }) => (
  <div className={`${styles.label} ${isDisabled ? styles.disabled : ''}`} data-test-id="taxLabel">
    <span>{label}</span><span>:</span>
  </div>
);

TaxLabel.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

export default props => (
  <LoadingContext.Consumer>
    {({ isLoading }) => (
      <TaxLabel {...props} isDisabled={isLoading(CART_PATH)} />
    )}
  </LoadingContext.Consumer>
);
