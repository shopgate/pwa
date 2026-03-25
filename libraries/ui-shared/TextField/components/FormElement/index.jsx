import React from 'react';
import PropTypes from 'prop-types';
import Input from '@shopgate/pwa-common/components/Input';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  input: {
    position: 'relative',
    padding: 0,
    width: '100%',
    marginTop: 24,
    outline: 0,
    fontSize: 16,
    lineHeight: '19px',
  },
  multiLine: {
    position: 'relative',
    marginTop: 24,
    marginBottom: 3,
    padding: 0,
    width: '100%',
    outline: 0,
    height: 19,
    minHeight: 19,
    lineHeight: '19px',
    verticalAlign: 'top',
  },
});

/**
 * Creates an input or a multiLine based on the type prop.
 * @param {Object} props The props.
 * @returns {JSX.Element}
 */
const FormElement = (props) => {
  const { classes } = useStyles();

  return (
    <Input
      {...props}
      className={props.multiLine ? classes.multiLine : classes.input}
      validateOnBlur
    />
  );
};

FormElement.propTypes = {
  multiLine: PropTypes.bool,
};

FormElement.defaultProps = {
  multiLine: false,
};

export default FormElement;
