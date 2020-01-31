import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The form element placeholder component.
 * @param {string} placeholder The placeholder text.
 * @param {boolean} visible Sets the placeholder visibility.
 * @return {JSX}
 */
const Placeholder = ({
  className, placeholder, visible, 'aria-hidden': ariaHidden,
}) => (
  <div
    className={classNames(styles.placeholderStyles(visible), className)}
    aria-hidden={ariaHidden}
  >
    <I18n.Text string={placeholder} />
  </div>
);

Placeholder.propTypes = {
  'aria-hidden': PropTypes.bool,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  placeholder: PropTypes.string,
  visible: PropTypes.bool,
};

Placeholder.defaultProps = {
  'aria-hidden': null,
  className: null,
  placeholder: '',
  visible: false,
};

export default Placeholder;
