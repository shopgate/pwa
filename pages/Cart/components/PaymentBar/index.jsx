import React from 'react';
import PropTypes from 'prop-types';
import Sheet from '@shopgate/pwa-ui-shared/Sheet';
import Content from './components/Content';
import styles from './style';

/**
 * The Payment Bar component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PaymentBar = ({ isVisible, onSize }) => (
  <Sheet isOpen={isVisible} backdrop={false} animation={styles.animation}>
    <Content onSize={onSize} />
  </Sheet>
);

PaymentBar.propTypes = {
  isVisible: PropTypes.bool,
  onSize: PropTypes.func,
};

PaymentBar.defaultProps = {
  isVisible: true,
  onSize: () => {},
};

export default PaymentBar;
