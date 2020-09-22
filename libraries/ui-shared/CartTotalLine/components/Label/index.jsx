import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { I18n } from '@shopgate/engage/components';
import styles from './style';

/**
 * The ShippingCostsLabel component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
function Label({
  label, showSeparator, labelParams, suffix,
}) {
  if (!label) {
    return <div className={styles.label} />;
  }

  return (
    <div className={styles.label}>
      <I18n.Text
        string={label}
        params={labelParams}
        className={classNames({
          [styles.labelWithSuffix]: !!suffix,
        })}
      />
      {suffix}
      {`${showSeparator ? ':' : ''}`}
    </div>
  );
}

Label.propTypes = {
  label: PropTypes.string,
  labelParams: PropTypes.shape(),
  showSeparator: PropTypes.bool,
  suffix: PropTypes.node,
};

Label.defaultProps = {
  label: null,
  suffix: null,
  showSeparator: true,
  labelParams: {},
};

export default Label;
