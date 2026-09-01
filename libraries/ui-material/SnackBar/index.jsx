import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { config } from 'react-spring';
import { Spring } from 'react-spring/renderprops.cjs';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import { i18n } from '@shopgate/engage/core/helpers';
import { useLongPress } from '@shopgate/engage/core/hooks/events';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';

const defaultToast = {};

// Approximate settle time of the slide-out (config.stiff). The current toast is removed from the
// queue this long after it starts sliding out, so the exit animation is fully visible before the
// next toast slides in. Timer-driven removal keeps queue advancement independent of the spring's
// onRest callback, which fires unreliably during the toast-to-toast handoff.
const EXIT_ANIMATION_MS = 500;

const useStyles = makeStyles()(theme => ({
  container: {
    position: 'fixed',
    height: 'var(--snack-bar-height, 80px)',
    bottom: `max(var(--footer-height), ${theme.layout.safeArea.bottom})`,
    transition: 'bottom 0.3s ease',
    overflow: 'hidden',
    zIndex: 6,
    width: '100%',
  },
  wrapper: {
    top: 'var(--snack-bar-height, 80px)',
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    width: '100%',
    zIndex: 6,
  },
  box: {
    alignItems: 'center',
    background: theme.components.snackbar.background,
    borderRadius: 3,
    boxShadow: '0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12)',
    color: theme.contrastColor(theme.components.snackbar.background),
    display: 'flex',
    fontSize: theme.typography.body2.fontSize,
    justifyContent: 'space-between',
    letterSpacing: 0.5,
    margin: 16,
    maxWidth: 344,
    minHeight: 48,
    padding: '6px 16px',
    width: '100%',
  },
  label: {
    lineHeight: 1.4,
    margin: '6px 0',
    overflow: 'hidden',
  },
  actionButton: {
    margin: '0 -8px 0 8px',
    minWidth: 0,
    padding: '0 8px',
    textTransform: 'uppercase',
  },
}));

/**
 * Calculates the required amount of rows for the snack bar.
 * @param {string} message The snack bar message.
 * @param {string} actionLabel The snack bar action label.
 * @return {number}
 */
const calcRows = (message, actionLabel) => {
  /**
   * @param {string} text Input text.
   * @returns {number} Row count for the text.
   */
  const rowsFor = text => Math.max(2, Math.ceil(text.length / 40));
  return rowsFor(`${message}${actionLabel.repeat(rowsFor(message))}`);
};

/**
 * The SnackBar component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const SnackBar = ({ removeToast, toasts: toastsProp }) => {
  const { classes, cx } = useStyles();
  const toasts = useMemo(() => toastsProp || [], [toastsProp]);
  const current = toasts.length ? toasts[0] : null;
  const currentId = current ? current.id : null;

  const [visible, setVisible] = useState(true);
  const autoHideTimer = useRef(null);
  const exitTimer = useRef(null);
  const pressingRef = useRef(false);

  // Latest values reachable from the stable timer callbacks below without re-creating them.
  const durationRef = useRef();
  durationRef.current = (current && current.duration) || 2500;
  const removeToastRef = useRef(removeToast);
  removeToastRef.current = removeToast;

  // Show whenever there is a toast to display; hide when the queue drains. Reacting to the queue
  // length is what slides the next toast in after the current one has been removed.
  useEffect(() => {
    setVisible(toasts.length > 0);
  }, [toasts.length]);

  useEffect(() => () => {
    clearTimeout(autoHideTimer.current);
    clearTimeout(exitTimer.current);
  }, []);

  const snack = useMemo(() => {
    const raw = current || defaultToast;
    return {
      ...raw,
      message: i18n.text(raw.message || '', raw.messageParams || {}),
      actionLabel: i18n.text(raw.actionLabel || ''),
    };
  }, [current]);

  // Slide the current toast out, then advance the queue once the exit animation has played. The
  // removal is timer-driven (not the spring's onRest), so it fires exactly once for the toast being
  // dismissed and can't be re-triggered by the spring re-settling as the next toast slides in.
  const hide = useCallback(() => {
    clearTimeout(autoHideTimer.current);
    clearTimeout(exitTimer.current);
    setVisible(false);
    exitTimer.current = setTimeout(() => removeToastRef.current(), EXIT_ANIMATION_MS);
  }, []);

  // (Re)starts the auto-hide countdown. Stable identity (reads the duration via a ref), so the
  // effect below only re-runs when the shown toast actually changes.
  const scheduleAutoHide = useCallback(() => {
    clearTimeout(autoHideTimer.current);
    autoHideTimer.current = setTimeout(hide, durationRef.current);
  }, [hide]);

  // Start the countdown once per shown toast, keyed on its id — NOT on the spring's onRest. With
  // `force`, onRest fires on every re-render, so scheduling the auto-hide there restarted the
  // countdown on each render and could keep a toast on screen far longer than its duration.
  useEffect(() => {
    if (!currentId) {
      return undefined;
    }
    scheduleAutoHide();
    return () => clearTimeout(autoHideTimer.current);
  }, [currentId, scheduleAutoHide]);

  const handleAction = useCallback(() => {
    current?.action?.();
    hide();
  }, [current, hide]);

  const handleLongPress = useCallback(() => {
    pressingRef.current = false;
    if (snack.onLongPress) {
      snack.onLongPress();
    }
    hide();
  }, [snack, hide]);

  // While a long press is held, freeze the auto-hide countdown so the toast can't disappear
  // mid-press. A press released before the threshold resumes the countdown from the start.
  const handlePressStart = useCallback(() => {
    pressingRef.current = true;
    clearTimeout(autoHideTimer.current);
  }, []);

  const handlePressCancel = useCallback(() => {
    pressingRef.current = false;
    if (currentId) {
      scheduleAutoHide();
    }
  }, [currentId, scheduleAutoHide]);

  const longPressHandlers = useLongPress(handleLongPress, {
    threshold: 4000,
    onStart: handlePressStart,
    onCancel: handlePressCancel,
  });

  const {
    action = null,
    actionLabel = null,
    message = null,
    onLongPress = null,
  } = snack;

  // A toast is either long-pressable or has a whole-box click action — never both. Attaching both
  // would let a single long press fire onLongPress (at the threshold) and then handleAction (on the
  // release click). Long-press takes precedence.
  const boxProps = onLongPress
    ? { ...longPressHandlers }
    : { ...(action && !actionLabel && { onClick: handleAction }) };

  const rows = calcRows(message, actionLabel);
  const snackBarHeight = 40 + (rows * 20);

  return (
    <div
      className={cx(classes.container, 'ui-material__snack-bar')}
      style={{ '--snack-bar-height': `${snackBarHeight}px` }}
    >
      <Spring
        from={{ top: snackBarHeight }}
        to={{ top: 0 }}
        config={config.stiff}
        reverse={!visible}
        force
      >
        {springProps => (
          // eslint-disable-next-line max-len
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            className={classes.wrapper}
            style={springProps}
            data-footer-inset-update-ignore="true"
            onClick={hide}
          >
            <div className={classes.box} {...boxProps}>
              <Ellipsis rows={rows}>
                <span className={classes.label} aria-live="assertive" role="status">
                  {message}
                </span>
              </Ellipsis>
              {(action && actionLabel) && (
                <Button
                  className={classes.actionButton}
                  variant="text"
                  size="small"
                  color="secondary"
                  onClick={handleAction}
                  aria-hidden
                >
                  {actionLabel}
                </Button>
              )}
            </div>
          </div>
        )}
      </Spring>
    </div>
  );
};

SnackBar.propTypes = {
  removeToast: PropTypes.func.isRequired,
  toasts: PropTypes.arrayOf(PropTypes.shape()),
};

SnackBar.defaultProps = {
  toasts: null,
};

export default SnackBar;
