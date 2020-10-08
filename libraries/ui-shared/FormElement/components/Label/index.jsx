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
const Label = ({
  hasErrorMessage, htmlFor, isFloating, isFocused, label, labelStatic,
}) => {
  const labelStyles = styles.labelStyles(isFocused, isFloating, hasErrorMessage, labelStatic);

  return (
    /* eslint-disable-next-line jsx-a11y/label-has-associated-control */
    <label
      htmlFor={htmlFor}
      className={classNames(labelStyles, 'label', {
        floating: isFloating,
      })}
    >
      <I18n.Text string={label} />
    </label>
  );
};

Label.propTypes = {
  hasErrorMessage: PropTypes.bool,
  htmlFor: PropTypes.string,
  isFloating: PropTypes.bool,
  isFocused: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  labelStatic: PropTypes.bool,
};

Label.defaultProps = {
  htmlFor: '',
  isFocused: false,
  isFloating: false,
  hasErrorMessage: false,
  label: '',
  labelStatic: false,
};

export default Label;
