import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The form element hint component.
 * @param {string} hintText The hint text.
 * @param {boolean} visible Sets the hint visibility.
 * @return {JSX}
 */
const Hint = ({ hintText, visible }) => (
  <div className={classNames(styles.hintStyles(visible), 'hint')}>
    <I18n.Text string={hintText} />
  </div>
);

Hint.propTypes = {
  hintText: PropTypes.string,
  visible: PropTypes.bool,
};

Hint.defaultProps = {
  hintText: '',
  visible: false,
};

export default Hint;
