import React from 'react';
import PropTypes from 'prop-types';
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
      className={labelStyles}
    >
      <I18n.Text string={props.label} />
    </label>
  );
};

Label.propTypes = {
  hasErrorMessage: PropTypes.bool,
  isFloating: PropTypes.bool,
  isFocused: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
};

Label.defaultProps = {
  name: '',
  label: '',
  isFocused: false,
  isFloating: false,
  hasErrorMessage: false,
};

export default Label;
