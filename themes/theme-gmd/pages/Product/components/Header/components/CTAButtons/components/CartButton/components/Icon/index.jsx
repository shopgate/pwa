import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import CartPlusIcon from '@shopgate/pwa-ui-shared/icons/CartPlusIcon';
import TickIcon from '@shopgate/pwa-ui-shared/icons/TickIcon';
import styles from './style';
import transition from './transition';

/**
 * The CartButtonIcon component.
 */
class CartButtonIcon extends PureComponent {
  static propTypes = {
    onSuccess: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    success: PropTypes.bool.isRequired,
  }

  state = {
    success: false,
  }

  /**
   * Set the success state when it is recieved as true.
   * @param {Object} nextProps The next component props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.success) {
      return;
    }

    this.setState({
      success: nextProps.success,
    });
  }

  reset = () => {
    this.setState({ success: false });
    this.props.onSuccess();
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <Transition
        in={this.state.success}
        timeout={800}
        onEntered={this.reset}
      >
        {state => (
          <div className={styles.container} style={transition[state]}>
            <CartPlusIcon className={styles.iconCart} size={24} />
            <TickIcon className={styles.iconTick} size={24} />
          </div>
        )}
      </Transition>
    );
  }
}

export default CartButtonIcon;
