import React from 'react';
import View from 'Components/View';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import styles from './style';

/**
 * Checkout dummy page.
 * @returns {JSX}
 */
const Checkout = () => (
  <View hasNavigator={false}>
    <div className={styles.wrapper}>
      <LoadingIndicator />
    </div>
  </View>
);

export default Checkout;
