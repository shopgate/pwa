import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CART_PAYMENT_BAR,
  CART_PAYMENT_BAR_BEFORE,
  CART_PAYMENT_BAR_AFTER,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import ShippingCostsLabel from './components/ShippingCostsLabel';
import ShippingCosts from './components/ShippingCosts';
import SubTotalLabel from './components/SubTotalLabel';
import SubTotal from './components/SubTotal';
import CheckoutButton from './components/CheckoutButton';
import styles from './style';

/**
 * The PaymentBarContent component.
 */
class PaymentBarContent extends PureComponent {
  static propTypes = {
    setBottom: PropTypes.func.isRequired,
  }

  /**
   * Update the ViewBottom with the height of the content.
   */
  componentDidMount() {
    this.props.setBottom(this.ref.current.clientHeight);
  }

  /**
   * Resets the ViewBottom.
   */
  componentWillUnmount() {
    this.props.setBottom(0);
  }

  ref = React.createRef();

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <div ref={this.ref}>
        <Portal name={CART_PAYMENT_BAR_BEFORE} />
        <Portal name={CART_PAYMENT_BAR}>
          <Grid className={styles.container}>
            <Grid.Item className={styles.labelColumn} grow={1}>
              <div className={styles.column}>
                <SubTotalLabel />
                <ShippingCostsLabel />
              </div>
            </Grid.Item>

            <Grid.Item className={styles.costsColumn} grow={1}>
              <div className={styles.column}>
                <SubTotal />
                <ShippingCosts />
              </div>
            </Grid.Item>

            <Grid.Item className={styles.buttonColumn} grow={1}>
              <div className={styles.column}>
                <div className={styles.checkoutButton}>
                  <CheckoutButton />
                </div>
              </div>
            </Grid.Item>
          </Grid>
        </Portal>
        <Portal name={CART_PAYMENT_BAR_AFTER} />
      </div>
    );
  }
}

export default PaymentBarContent;
