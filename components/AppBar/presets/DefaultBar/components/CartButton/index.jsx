import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { AppBar } from '@shopgate/pwa-ui-material';
import { CartIcon } from '@shopgate/pwa-ui-shared';
import colors from 'Styles/colors';
import Badge from '../CartBadge';
import connect from './connector';
import styles from './style';
import transition from './transition';

/**
 * The CartButton component.
 */
class CartButton extends PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
    navigate: PropTypes.func.isRequired,
  };

  /**
   * @returns {JSX}
   */
  get badge() {
    const { count } = this.props;
    return () => <Badge count={count} />;
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { count, navigate } = this.props;

    return (
      <Transition in={count > 0} timeout={250}>
        {state => (
          <div className={styles} style={transition[state]}>
            <AppBar.Icon
              background={colors.primary}
              badge={this.badge}
              color={colors.primaryContrast}
              icon={CartIcon}
              onClick={navigate}
            />
          </div>
        )}
      </Transition>
    );
  }
}

export default connect(CartButton);
