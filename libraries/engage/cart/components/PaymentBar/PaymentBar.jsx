import * as React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import { createPortal } from 'react-dom';
import PaymentBarContent from './PaymentBarContent';

/**
 * The cart payment bar component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function PaymentBar({ visible, showSeparator }) {
  const domElement = document.getElementById('AppFooter');

  if (!visible || !domElement) {
    return null;
  }

  return createPortal(<PaymentBarContent showSeparator={showSeparator} />, domElement);
}

PaymentBar.propTypes = {
  showSeparator: PropTypes.bool,
  visible: PropTypes.bool,
};

PaymentBar.defaultProps = {
  visible: true,
  showSeparator: false,
};

export default hot(PaymentBar);
