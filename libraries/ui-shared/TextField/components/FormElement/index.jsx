import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@shopgate/engage/components';
import styles from './style';

/**
 * Creates an input or a multiLine based on the type prop.
 * @param {Object} props The props.
 * @returns {JSX.Element}
 */
const FormElement = (props) => {
  const styleType = props.multiLine ? 'multiLine' : 'input';
  return (
    <Input
      {...props}
      className={styles[styleType]}
      validateOnBlur
    />);
};

FormElement.propTypes = {
  multiLine: PropTypes.bool,
};

FormElement.defaultProps = {
  multiLine: false,
};

export default FormElement;
