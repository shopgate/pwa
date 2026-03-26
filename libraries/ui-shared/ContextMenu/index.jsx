import React, {
  useState, useEffect, useRef,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { ConnectedReactPortal } from '@shopgate/engage/components';
import classNames from 'classnames';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import { FocusTrap } from '@shopgate/engage/a11y/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import MoreVertIcon from '../icons/MoreVertIcon';
import Position from './components/Position';
import Item from './components/Item';
import ContextMenuProvider from './ContextMenuProvider';

const useStyles = makeStyles()(theme => ({
  container: {
    position: 'relative',
  },
  button: {
    display: 'block',
    fontSize: '1.5rem',
    outline: 0,
    padding: 0,
    color: 'inherit',
  },
  disabled: {
    cursor: 'not-allowed',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: theme.spacing(1, 0),
    minWidth: 130,
    background: themeConfig.colors.light,
    borderRadius: 2,
    boxShadow: themeConfig.shadows.contextMenu,
  },
  scrollable: {
    maxHeight: '30vh',
    overflowY: 'auto',
  },
}));

/**
 * The Context Menu component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ContextMenu = (props) => {
  const {
    children, classes: parentClasses, disabled, showToggle, scroll, isOpened, onStateChange,
  } = props;

  const { classes } = useStyles();
  const [active, setActive] = useState(isOpened);
  const elementRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (typeof isOpened === 'boolean' && active !== isOpened) {
      setActive(isOpened);
    }
  }, [active, isOpened]);

  useEffect(() => {
    if (active && menuRef.current) {
      menuRef.current.focus();
    }
  }, [active]);

  const handleMenuToggle = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (elementRef.current) {
      setActive((prevActive) => {
        const newState = !prevActive;
        if (onStateChange) {
          onStateChange({ active: newState });
        }
        return newState;
      });
    }
  }, [onStateChange]);

  const offset = elementRef.current
    ? elementRef.current.getBoundingClientRect()
    : {
      top: 0,
      left: 0,
    };
  const useScroll = typeof scroll === 'boolean' && !!scroll;

  return (
    <div
      data-test-id="contextMenu"
      ref={elementRef}
      className={classNames(classes.container, parentClasses.container, 'ui-shared__context-menu')}
    >
      {showToggle && (
        <button
          className={classNames(classes.button, parentClasses.button, {
            [classes.disabled]: disabled,
          })}
          onClick={handleMenuToggle}
          disabled={disabled}
          type="button"
          aria-label={i18n.text('navigation.open_menu')}
          aria-haspopup="true"
          aria-expanded={active}
          aria-controls="contextMenuDialog"
        >
          <MoreVertIcon aria-hidden />
        </button>
      )}
      <ConnectedReactPortal isOpened={active}>
        <FocusTrap active={active}>
          <div className={classes.overlay}>
            <Backdrop isVisible level={0} opacity={0} onClick={handleMenuToggle} />
            <Position offset={offset}>
              <ContextMenuProvider handleMenuToggle={handleMenuToggle}>
                <div
                  className={classNames(classes.menu, { [classes.scrollable]: useScroll })}
                  ref={menuRef}
                  tabIndex="-1"
                  aria-modal="true"
                  role="dialog"
                >
                  {children}
                  <button
                    onClick={handleMenuToggle}
                    className="sr-only"
                    aria-label={i18n.text('common.close')}
                    type="button"
                  >
                    {i18n.text('common.close')}
                  </button>
                </div>
              </ContextMenuProvider>
            </Position>
          </div>
        </FocusTrap>
      </ConnectedReactPortal>
    </div>
  );
};

ContextMenu.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.shape({
    container: PropTypes.string,
    button: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  isOpened: PropTypes.bool,
  onStateChange: PropTypes.func,
  scroll: PropTypes.bool,
  showToggle: PropTypes.bool,
};

ContextMenu.defaultProps = {
  children: null,
  classes: {
    container: '',
    button: '',
  },
  disabled: false,
  showToggle: true,
  isOpened: null,
  onStateChange: null,
  scroll: null,
};

ContextMenu.Item = Item;

export default ContextMenu;
