import React from 'react';
import PropTypes from 'prop-types';
import Consume from '@shopgate/pwa-common/components/Consume';
import { ViewContext } from 'Components/View/context';
import Sheet from '@shopgate/pwa-ui-shared/Sheet';
import Content from './components/Content';
import styles from './style';

const viewMap = {
  setBottom: 'setBottom',
};

/**
 * The Payment Bar component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PaymentBar = ({ visible }) => (
  <Sheet isOpen={visible} backdrop={false} animation={styles.animation}>
    <Consume context={ViewContext} props={viewMap}>
      {({ setBottom }) => (
        <Content setBottom={setBottom} />
      )}
    </Consume>
  </Sheet>
);

PaymentBar.propTypes = {
  visible: PropTypes.bool,
};

PaymentBar.defaultProps = {
  visible: true,
};

export default PaymentBar;
