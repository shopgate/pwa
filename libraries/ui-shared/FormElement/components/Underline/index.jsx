import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';

/**
 *  Renders the label element.
 * @param {Object} props  The component props.
 * @return {JSX}
 */
const Underline = props => (
  <div className={classNames(styles.underlineWrapper, props.className)}>
    <div
      className={styles.underline}
      style={styles.underlineStyle(props.isFocused, props.hasErrorMessage)}
    />
  </div>
);

Underline.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  hasErrorMessage: PropTypes.bool,
  isFocused: PropTypes.bool,
};

Underline.defaultProps = {
  className: null,
  isFocused: false,
  hasErrorMessage: false,
};

export default Underline;
