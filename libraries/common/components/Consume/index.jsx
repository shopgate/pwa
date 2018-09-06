import React from 'react';
import PropTypes from 'prop-types';
import buildParams from './helpers/buildParams';

/**
 * @param {Function} props.children The child function to call.
 * @param {Object} props.context The react context.
 * @param {Object} props.props The props to create.
 * @returns {JSX}
 */
const Consume = ({ children, context: { Consumer }, props }) => (
  <Consumer>
    {value => children(buildParams(value, props))}
  </Consumer>
);

Consume.propTypes = {
  children: PropTypes.func.isRequired,
  context: PropTypes.shape().isRequired,
  props: PropTypes.shape().isRequired,
};

export default Consume;
