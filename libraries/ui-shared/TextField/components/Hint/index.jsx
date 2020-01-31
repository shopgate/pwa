import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The form element hint component.
 * @param {string|Object|null|undefined} className Custom class name.
 * @param {string} hintText The hint text.
 * @param {boolean} visible Sets the hint visibility.
 * @return {JSX}
 */
const Hint = ({ className, hintText, visible }) => (
  <div className={classNames(styles.hintStyles(visible), className)}>
    <I18n.Text string={hintText} />
  </div>
);

Hint.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  hintText: PropTypes.string,
  visible: PropTypes.bool,
};

Hint.defaultProps = {
  className: null,
  hintText: '',
  visible: false,
};

export default Hint;
