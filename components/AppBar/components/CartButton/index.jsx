import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AppBar, CartIcon } from '@shopgate/pwa-ui-ios';
import Badge from './components/CartBadge';
import connect from './connector';
import styles from './style';

/**
 * @returns {JSX}
 */
const Icon = () => (
  <CartIcon size={20} />
);

/**
 * The CartButton component.
 */
class CartButton extends PureComponent {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { navigate } = this.props;

    return (
      <div className={styles}>
        <AppBar.Icon
          badge={Badge}
          icon={Icon}
          onClick={navigate}
        />
      </div>
    );
  }
}

export default connect(CartButton);
