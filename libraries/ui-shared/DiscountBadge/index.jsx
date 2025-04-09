import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import styles from './style';

/**
 * The discount badge component.
 * @param {Object} props The component props
 * @param {string} [props.className] Additional CSS style definitions
 * @param {string} props.text The text contents of the component.
 * @returns {JSX.Element}
 */
const DiscountBadge = ({
  text,
  className,
  display,
  discount,
}) => (
  <div
    data-test-id={text}
    className="ui-shared__discount-badge"
    aria-label={`${i18n.text('cart.discount')}: ${text}`}
    tabIndex={-1}
  >
    <I18n.Text
      className={`${styles[display]} ${className}`}
      string={text}
      params={[discount]}
      aria-hidden
    />
  </div>
);

DiscountBadge.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  discount: PropTypes.number,
  display: PropTypes.oneOf(Object.keys(styles)),
};

DiscountBadge.defaultProps = {
  className: '',
  discount: null,
  display: 'small',
};

export default DiscountBadge;
