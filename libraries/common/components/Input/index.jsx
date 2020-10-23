import React from 'react';
import PropTypes from 'prop-types';
import SimpleInput from './components/SimpleInput';
import MultiLineInput from './components/MultiLineInput';
import DateInput from './components/DateInput';

/**
 * @returns {boolean}
 */
const isDateSupported = () => {
  const input = document.createElement('input');
  const value = 'a';
  input.setAttribute('type', 'date');
  input.setAttribute('value', value);
  return (input.value !== value);
};

/**
 * Input component.
 *
 * @param {Object} props Props
 * @return {JSX}
 */
const Factory = (props) => {
  if (props.type === 'date' && !isDateSupported()) {
    return <DateInput {...props} />;
  }

  if (props.multiLine) {
    return <MultiLineInput {...props} />;
  }
  return <SimpleInput {...props} />;
};

Factory.propTypes = {
  multiLine: PropTypes.bool,
  type: PropTypes.string,
};

Factory.defaultProps = {
  multiLine: false,
  type: null,
};

export default props => Factory(props);
