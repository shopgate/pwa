import React, {
  useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { ConnectedReactPortal } from '@shopgate/engage/components';
import classNames from 'classnames';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import { FocusTrap } from 'focus-trap-react';
import { i18n } from '@shopgate/engage/core';
import MoreVertIcon from '../icons/MoreVertIcon';
import Position from './components/Position';
import Item from './components/Item';
import styles from './style';
import ContectMenuProvider from './ContextMenuProvider';

/**
 * The Context Menu component.
  * @param {Object} props The component props.
  * @param {Object} props.children The menu items.
  * @param {Object} props.classes The classes for the container and button.
  * @param {boolean} props.disabled Whether the menu is disabled.
  * @param {boolean} props.isOpened Whether the menu is opened.
  * @param {Function} props.onStateChange A callback that is called when the menu state changes.
  * @param {boolean} props.scroll Whether the menu should be scrollable.
  * @param {boolean} props.showToggle Whether the toggle button should be shown.
  * @returns {JSX}
  */
const ContextMenu = (props) => {
  const {
    children, classes, disabled, showToggle, scroll, isOpened, onStateChange,
  } = props;

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

  /**
   * Handles the menu toggle.
   * @param {Object} e The event object.
  */
  const handleMenuToggle = (e) => {
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
  };

  const offset = elementRef.current ?
    elementRef.current.getBoundingClientRect() :
    {
      top: 0,
      left: 0,
    };
  const useScroll = typeof scroll === 'boolean' && !!scroll;

  return (
    <div
      data-test-id="contextMenu"
      ref={elementRef}
      className={classNames(styles.container, classes.container, 'ui-shared__context-menu')}
    >
      {showToggle && (
        <button
          className={classNames(styles.button, classes.button, {
            [styles.disabled]: disabled,
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
          <div className={styles.overlay}>
            <Backdrop isVisible level={0} opacity={0} onClick={handleMenuToggle} />
            <Position offset={offset}>
              <ContectMenuProvider handleMenuToggle={handleMenuToggle}>
                <div
                  className={classNames(styles.menu, { [styles.scrollable]: useScroll })}
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
              </ContectMenuProvider>
            </Position>
          </div>
        </FocusTrap>
      </ConnectedReactPortal>
    </div>
  );
};

ContextMenu.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.shape(),
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
