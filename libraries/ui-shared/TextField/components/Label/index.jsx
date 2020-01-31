import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * Renders the label element.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Label = (props) => {
  const labelStyles = styles.labelStyles(props.isFocused, props.isFloating, props.hasErrorMessage);

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      htmlFor={props.name}
      className={classNames(labelStyles, props.className)}
    >
      <I18n.Text string={props.label} />
    </label>
  );
};

Label.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  hasErrorMessage: PropTypes.bool,
  isFloating: PropTypes.bool,
  isFocused: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
};

Label.defaultProps = {
  className: null,
  name: '',
  label: '',
  isFocused: false,
  isFloating: false,
  hasErrorMessage: false,
};

export default Label;
