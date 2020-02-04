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
  <div className={classNames(styles.underlineWrapper, 'underline')}>
    <div
      className={styles.underline}
      style={styles.underlineStyle(props.isFocused, props.hasErrorMessage)}
    />
  </div>
);

Underline.propTypes = {
  hasErrorMessage: PropTypes.bool,
  isFocused: PropTypes.bool,
};

Underline.defaultProps = {
  isFocused: false,
  hasErrorMessage: false,
};

export default Underline;
