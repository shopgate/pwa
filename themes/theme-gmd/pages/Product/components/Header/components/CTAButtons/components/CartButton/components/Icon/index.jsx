import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import CartPlusIcon from '@shopgate/pwa-ui-shared/icons/CartPlusIcon';
import TickIcon from '@shopgate/pwa-ui-shared/icons/TickIcon';
import styles from './style';
import transition from './transition';

/**
 * The CartButtonIcon component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function CartButtonIcon(props) {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSuccess(props.success);
  }, [props.success]);

  /**
   * Performs a reset of the component.
   */
  function reset() {
    setSuccess(false);
    props.onSuccess();
  }

  return (
    <Transition in={success} timeout={800} onEntered={reset}>
      {state => (
        <div className={styles.container} style={transition[state]}>
          <CartPlusIcon className={styles.iconCart} size={24} />
          <TickIcon className={styles.iconTick} size={24} />
        </div>
      )}
    </Transition>
  );
}

CartButtonIcon.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
};

export default memo(CartButtonIcon);
