import React from 'react';
import PropTypes from 'prop-types';
import SimpleInput from './components/SimpleInput';
import MultiLineInput from './components/MultiLineInput';

/**
 * Input component.
 *
 * @param {Object} props Props
 * @return {JSX}
 */
const Factory = (props) => {
  if (props.multiLine) {
    return <MultiLineInput {...props} />;
  }
  return <SimpleInput {...props} />;
};

Factory.propTypes = {
  multiLine: PropTypes.bool,
};

Factory.defaultProps = {
  multiLine: false,
};

export default props => Factory(props);
