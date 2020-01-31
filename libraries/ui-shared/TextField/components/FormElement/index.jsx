import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Input from '@shopgate/pwa-common/components/Input';
import styles from './style';

/**
 * Creates an input or a multiLine based on the type prop.
 * @param {Object} props The props.
 * @returns {JSX}
 */
const FormElement = (props) => {
  const styleType = props.multiLine ? 'multiLine' : 'input';
  return (
    <Input
      {...props}
      className={classNames(styles[styleType], props.className)}
      validateOnBlur
    />);
};

FormElement.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  multiLine: PropTypes.bool,
};

FormElement.defaultProps = {
  className: null,
  multiLine: false,
};

export default FormElement;
