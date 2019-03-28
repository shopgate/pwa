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
const Label = (props) => {
  const {
    isDisabled, label, showSeparator, type,
  } = props;

  return (
    <div
      className={classNames(styles.amount, { [styles.disabled]: isDisabled })}
      data-test-id={`${type}Label`}
    >
      <I18n.Text string={label} />
      {showSeparator && ':'}
    </div>
  );
};

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
