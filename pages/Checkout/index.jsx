import React, { Component } from 'react';
import View from 'Components/View';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import styles from './style';

/**
 * Checkout dummy page.
 */
class Checkout extends Component {
  /**
   * Constructs.
   * @param {Object} props Props.
   */
  constructor(props) {
    super(props);
    this.state = {
      showIndicator: false,
    };
    this.timeout = undefined;
  }

  /**
   * Sets a timeout for showing the indicator.
   */
  componentWillMount() {
    this.timeout = setTimeout(() => {
      this.setState({
        showIndicator: true,
      });
    }, 3000);
  }

  /**
   * Clears a timeout.
   */
  componentDidUnmount() {
    clearTimeout(this.timeout);
  }
  /**
   * Renders.
   * @returns {JSX}
   */
  render() {
    return (
      <View hasNavigator={false}>
        <div className={styles.wrapper}>
          {this.state.showIndicator && <LoadingIndicator /> }
        </div>
      </View>
    );
  }
}

export default Checkout;
