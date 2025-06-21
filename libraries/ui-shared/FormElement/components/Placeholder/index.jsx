import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The form element placeholder component.
 * @param {string} placeholder The placeholder text.
 * @param {boolean} visible Sets the placeholder visibility.
 * @param {boolean} props['aria-hidden'] Accessibility attribute to mark the placeholder as hidden
 * @param {boolean} hasLeftElement Whether a left element is present
 * @return {JSX.Element}
 */
const Placeholder = ({
  placeholder,
  visible,
  'aria-hidden': ariaHidden,
  hasLeftElement,
}) => (
  <div
    className={classNames(styles.placeholderStyles(visible, hasLeftElement), 'placeholder')}
    aria-hidden={ariaHidden}
  >
    <I18n.Text string={placeholder} />
  </div>
);

Placeholder.propTypes = {
  'aria-hidden': PropTypes.bool,
  hasLeftElement: PropTypes.bool,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  visible: PropTypes.bool,
};

Placeholder.defaultProps = {
  'aria-hidden': null,
  hasLeftElement: false,
  placeholder: '',
  visible: false,
};

export default Placeholder;
