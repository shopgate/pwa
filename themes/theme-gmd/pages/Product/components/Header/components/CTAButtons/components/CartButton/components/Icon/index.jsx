import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import CartPlusIcon from '@shopgate/pwa-ui-shared/icons/CartPlusIcon';
import TickIcon from '@shopgate/pwa-ui-shared/icons/TickIcon';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import transition from './transition';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  container: {
    transition: 'transform 400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    willChange: 'transform',
  },
  iconCart: {
    boxSizing: 'content-box',
    padding: 16,
    fill: 'var(--color-button-cta-contrast)',
  },
  iconCartDisabled: {
    boxSizing: 'content-box',
    padding: 16,
    fill: colors.light,
  },
  iconTick: {
    boxSizing: 'content-box',
    padding: 16,
    fill: 'var(--color-button-cta)',
  },
});

/**
 * The CartButtonIcon component.
 * @param {Object} props Props.
 * @param {boolean} props.disabled Whether interaction is disabled.
 * @param {Function} props.onSuccess Called when success animation finishes.
 * @param {boolean} props.success External success trigger.
 * @returns {JSX.Element}
 */
const CartButtonIcon = ({ disabled, onSuccess, success }) => {
  const { classes } = useStyles();
  const [localSuccess, setLocalSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      setLocalSuccess(true);
    }
  }, [success]);

  const reset = useCallback(() => {
    setLocalSuccess(false);
    onSuccess();
  }, [onSuccess]);

  const iconClass = disabled ? classes.iconCartDisabled : classes.iconCart;

  return (
    <Transition
      in={localSuccess}
      timeout={800}
      onEntered={reset}
    >
      {state => (
        <div className={classes.container} style={transition[state]}>
          <CartPlusIcon className={iconClass} size={24} />
          <TickIcon className={classes.iconTick} size={24} />
        </div>
      )}
    </Transition>
  );
};

CartButtonIcon.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
};

export default CartButtonIcon;
