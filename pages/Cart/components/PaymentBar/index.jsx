import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Content from './components/Content';

/**
 * The PaymentBar component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PaymentBar = ({ visible }) => (
  visible && createPortal(
    <Content />,
    document.getElementById('AppFooter')
  )
);

PaymentBar.propTypes = {
  visible: PropTypes.bool,
};

PaymentBar.defaultProps = {
  visible: true,
};

export default PaymentBar;
