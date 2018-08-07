import React from 'react';
import PropTypes from 'prop-types';
import ToastContext from '../../providers/toast/context';

/**
 * The Toaster component.
 * @returns {JSX}
 */
const Toaster = ({ render }) => (
  <ToastContext.Consumer>
    {context => render(context)}
  </ToastContext.Consumer>
);

Toaster.propTypes = {
  render: PropTypes.func.isRequired,
};

export default Toaster;
