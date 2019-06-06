import React from 'react';
import PropTypes from 'prop-types';
import I18n from '../I18n';
import styles from './style';

/**
 * Renders a label that is only visible for screen readers.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function ScreenReaderLabel({ label }) {
  if (!label) {
    return null;
  }

  return (
    <span className={styles}>
      <I18n.Text string={label} />
    </span>
  );
}

ScreenReaderLabel.propTypes = {
  label: PropTypes.string,
};

ScreenReaderLabel.defaultProps = {
  label: null,
};

export default ScreenReaderLabel;
