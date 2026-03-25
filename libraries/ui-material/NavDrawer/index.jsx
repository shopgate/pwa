import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import Transition from 'react-transition-group/Transition';
import { Backdrop } from '@shopgate/engage/components';
import { ModalStateTracker } from '@shopgate/engage/a11y/components';
import { UIEvents } from '@shopgate/pwa-core';
import { themeShadows, themeColors } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import Divider from './components/Divider';
import Item from './components/Item';
import Section from './components/Section';
import Title from './components/Title';
import transition from './transition';

const OPEN = 'navdrawer_open';
const CLOSE = 'navdrawer_close';

const useStyles = makeStyles()({
  content: {
    fontSize: 14,
    height: '100%',
    overflowY: 'scroll',
    paddingBottom: 'var(--safe-area-inset-bottom)',
    WebkitOverflowScrolling: 'touch',
  },
  drawer: {
    background: themeColors.light,
    boxShadow: themeShadows.navDrawer,
    color: themeColors.dark,
    height: '100vh',
    left: 0,
    maxWidth: '300px',
    position: 'fixed',
    top: 0,
    transition: 'transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    width: '100%',
    willChange: 'transform',
    zIndex: 50,
    '@media(max-width: 480px)': {
      maxWidth: '67vw',
    },
  },
});

/**
 * Material navigation drawer; opens/closes via `NavDrawer.open()` / `NavDrawer.close()` (UIEvents).
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const NavDrawer = ({
  children,
  'aria-hidden': ariaHiddenProp,
  onClose,
  onOpen,
}) => {
  const { classes, cx } = useStyles();
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const a11yCloseRef = useRef(null);
  const triggerElementRef = useRef(null);

  useEffect(() => {
    /**
     * Opens the drawer and stores the active element for focus restore.
     * @returns {void}
     */
    const handleOpenEvent = () => {
      triggerElementRef.current = document.activeElement;
      setOpen(true);
    };
    /**
     * Closes the drawer (event listener).
     * @returns {void}
     */
    const handleCloseEvent = () => {
      setOpen(false);
    };
    UIEvents.addListener(OPEN, handleOpenEvent);
    UIEvents.addListener(CLOSE, handleCloseEvent);
    return () => {
      UIEvents.removeListener(OPEN, handleOpenEvent);
      UIEvents.removeListener(CLOSE, handleCloseEvent);
    };
  }, []);

  const closeDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  const handleEntering = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const handleEntered = useCallback(() => {
    a11yCloseRef.current?.focus();
  }, []);

  const handleExiting = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleExited = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    const trigger = triggerElementRef.current;
    if (trigger && typeof trigger.focus === 'function') {
      trigger.focus();
    }
  }, []);

  return (
    <>
      <Transition
        onEntering={handleEntering}
        onEntered={handleEntered}
        onExited={handleExited}
        onExiting={handleExiting}
        in={open}
        timeout={300}
      >
        {state => (
          <ModalStateTracker isVisible={open}>
            <section
              className={cx(classes.drawer, 'ui-material__nav-drawer')}
              data-test-id="NavDrawer"
              style={transition[state]}
              aria-hidden={ariaHiddenProp || state === 'exited'}
              tabIndex="-1"
            >
              <Item label="common.close" ref={a11yCloseRef} srOnly />
              <nav className={classes.content} ref={contentRef}>
                {children}
              </nav>
            </section>
          </ModalStateTracker>
        )}
      </Transition>
      <Backdrop
        isVisible={open}
        level={4}
        onClick={closeDrawer}
        opacity={20}
      />
    </>
  );
};

NavDrawer.propTypes = {
  children: PropTypes.node.isRequired,
  'aria-hidden': PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

NavDrawer.defaultProps = {
  'aria-hidden': false,
  onClose: noop,
  onOpen: noop,
};

NavDrawer.EVENT_OPEN = OPEN;
NavDrawer.EVENT_CLOSE = CLOSE;
NavDrawer.Divider = Divider;
NavDrawer.Item = Item;
NavDrawer.Section = Section;
NavDrawer.Title = Title;
NavDrawer.open = () => {
  UIEvents.emit(OPEN);
};
NavDrawer.close = () => {
  UIEvents.emit(CLOSE);
};

export default NavDrawer;
