import React from 'react';
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
 * @param {Function} props.count The number of products in the cart.
 * @param {Function} props.navigate A navigate action.
 * @returns {JSX}
 */
function CartButton({ count, navigate }) {
  return (
    <Transition in={!!count} timeout={250}>
      {state => (
        <div className={styles} style={transition[state]}>
          <AppBar.Icon
            background={colors.primary}
            badge={() => <Badge count={count} />}
            color={colors.primaryContrast}
            icon={CartIcon}
            onClick={navigate}
          />
        </div>
      )}
    </Transition>
  );
}

CartButton.propTypes = {
  count: PropTypes.number.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default connect(CartButton);
