import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import { config } from 'react-spring';
import { Spring } from 'react-spring/renderprops.cjs';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import { i18n } from '@shopgate/engage/core/helpers';
import { themeColors, themeShadows } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const defaultToast = {};

const backgroundColor = themeColors.lightDark;
const buttonColor = themeColors.accent;
const buttonColorContrast = Color(buttonColor).contrast(Color(backgroundColor));
const safeButtonColor = buttonColorContrast > 4 ? buttonColor : themeColors.light;

const useStyles = makeStyles()({
  container: {
    position: 'fixed',
    height: 'var(--snack-bar-height, 80px)',
    bottom: 'max(var(--footer-height), var(--safe-area-inset-bottom))',
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
    background: backgroundColor,
    borderRadius: 3,
    boxShadow: themeShadows.toast,
    color: themeColors.light,
    display: 'flex',
    fontSize: '0.875rem',
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
    color: safeButtonColor,
    fontWeight: 500,
    height: 36,
    letterSpacing: 'inherit',
    margin: '0 -8px 0 8px',
    outline: 0,
    padding: '0 8px',
    textTransform: 'uppercase',
  },
});

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
  const { classes } = useStyles();
  const toasts = useMemo(() => toastsProp || [], [toastsProp]);
  const [visible, setVisible] = useState(true);
  const visibleRef = useRef(visible);
  const timerRef = useRef(null);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    setVisible(toasts.length > 0);
  }, [toasts.length]);

  const snack = useMemo(() => {
    const raw = toasts.length ? toasts[0] : defaultToast;
    return {
      ...raw,
      message: i18n.text(raw.message || '', raw.messageParams || {}),
      actionLabel: i18n.text(raw.actionLabel || ''),
    };
  }, [toasts]);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  const handleAction = useCallback(() => {
    clearTimeout(timerRef.current);
    if (toasts[0]) {
      toasts[0].action();
    }
    hide();
  }, [toasts, hide]);

  const handleRest = useCallback(() => {
    if (visibleRef.current) {
      const duration = toasts[0]?.duration || 2500;
      timerRef.current = setTimeout(hide, duration);
    } else {
      removeToast();
    }
  }, [toasts, hide, removeToast]);

  const {
    action = null,
    actionLabel = null,
    message = null,
  } = snack;

  const boxProps = {
    ...(action && !actionLabel && { onClick: handleAction }),
  };

  const rows = calcRows(message, actionLabel);
  const snackBarHeight = 40 + (rows * 20);

  return (
    <div
      className={`${classes.container} ui-material__snack-bar`}
      style={{ '--snack-bar-height': `${snackBarHeight}px` }}
    >
      <Spring
        from={{ top: snackBarHeight }}
        to={{ top: 0 }}
        config={config.stiff}
        reverse={!visible}
        force
        onRest={handleRest}
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
                <button
                  className={classes.actionButton}
                  onClick={handleAction}
                  type="button"
                  aria-hidden
                >
                  {actionLabel}
                </button>
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
