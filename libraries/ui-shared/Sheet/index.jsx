import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import Drawer from '@shopgate/pwa-common/components/Drawer';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles, keyframes, responsiveMediaQuery } from '@shopgate/engage/styles';
import ProgressBar from '../ProgressBar';
import Header from './components/Header';

export const SHEET_EVENTS = {
  OPEN: 'Sheet.open',
  CLOSE: 'Sheet.close',
};

const duration = 300;
const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

const slideInSheetDrawer = keyframes({
  '0%': { transform: 'translateY(100%)' },
  '100%': { transform: 'translateY(0)' },
});

const fadeInSheetDrawer = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const slideOutSheetDrawer = keyframes({
  '0%': { transform: 'translateY(0)' },
  '100%': { transform: 'translateY(100%)' },
});

const fadeOutSheetDrawer = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const useStyles = makeStyles()(theme => ({
  section: {
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      margin: 'auto',
      zIndex: 100,
    },
  },
  container: {
    bottom: 0,
    background: themeConfig.colors.light,
    width: '100vw',
    [responsiveMediaQuery('<xl', { appOnly: true })]: {
      maxWidth: 640,
    },
    left: 0,
    right: 0,
    margin: '0 auto',
    color: theme.palette.text.primary,
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      position: 'initial',
    },
    [responsiveMediaQuery('>md', { webOnly: true })]: {
      width: '60%',
    },
  },
  containerFullScreen: {
    height: [
      `calc(100vh - ${themeConfig.variables.navigator.height}px - 51px)`,
      `calc(100vh - ${themeConfig.variables.navigator.height}px - 51px - var(--safe-area-inset-top))`,
    ],
  },
  progressBarContainer: {
    position: 'relative',
  },
  sheetShadow: {
    boxShadow: themeConfig.shadows.sheet,
  },
  content: {
    maxHeight: [
      `calc(var(--vh-100, 100vh) - ${themeConfig.variables.navigator.height}px)`,
      `calc(var(--vh-100, 100vh) - ${themeConfig.variables.navigator.height}px - var(--safe-area-inset-top))`,
    ],
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      maxHeight: [
        `calc(var(--vh-80, 80vh) - ${themeConfig.variables.navigator.height}px)`,
        `calc(var(--vh-80, 80vh) - ${themeConfig.variables.navigator.height}px - var(--safe-area-inset-top))`,
      ],
    },
    paddingBottom: [
      'var(--safe-area-inset-bottom)',
    ],
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
  },
  drawerAnimIn: {
    [responsiveMediaQuery('<=sm', { appAlways: true })]: {
      animation: `${slideInSheetDrawer} ${duration}ms 1 both ${easing}`,
    },
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      animation: `${fadeInSheetDrawer} ${duration}ms 1 both ${easing}`,
    },
  },
  drawerAnimOut: {
    [responsiveMediaQuery('<=sm', { appAlways: true })]: {
      animation: `${slideOutSheetDrawer} ${duration}ms 1 both ${easing}`,
    },
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      animation: `${fadeOutSheetDrawer} ${duration}ms 1 both ${easing}`,
    },
  },
}));

/**
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const SheetView = ({
  allowClose,
  animationFromParent,
  backdrop,
  children,
  className,
  contentClassName,
  contentRef,
  duration: durationProp,
  isLoading,
  isOpen,
  onClose,
  onDidClose,
  onDidOpen,
  onOpen,
  onScroll,
  scrolled,
  showSearch,
  title,
  handleSearchInput,
}) => {
  const { classes, cx } = useStyles();

  const animation = useMemo(() => ({
    duration: durationProp,
    in: classes.drawerAnimIn,
    out: classes.drawerAnimOut,
    ...animationFromParent,
  }), [
    durationProp,
    classes.drawerAnimIn,
    classes.drawerAnimOut,
    animationFromParent,
  ]);

  const drawerClassNames = cx(
    classes.container,
    { [className]: className }
  );

  const contentClassNames = cx(
    classes.content,
    { [classes.containerFullScreen]: showSearch },
    { [contentClassName]: contentClassName },
    { [classes.sheetShadow]: !backdrop }
  );

  return (
    <section
      className={cx('ui-shared__sheet', {
        [classes.section]: isOpen,
      })}
    >
      <Drawer
        className={drawerClassNames}
        isOpen={isOpen}
        onDidOpen={onDidOpen}
        onDidClose={onDidClose}
        onOpen={onOpen}
        onClose={onClose}
        animation={animation}
      >
        {title && (
          <Header
            showSearch={showSearch}
            handleChange={handleSearchInput}
            onToggleClose={onClose}
            shadow={scrolled}
            title={title}
            allowClose={allowClose}
          />
        )}
        <div className={classes.progressBarContainer}>
          <ProgressBar isVisible={isLoading} />
        </div>
        <div
          ref={contentRef}
          onScroll={onScroll}
          className={contentClassNames}
        >
          {children}
        </div>
      </Drawer>
      {backdrop && (
        <Backdrop
          isVisible={isOpen}
          level={4}
          onClick={allowClose ? onClose : () => {}}
          opacity={20}
        />
      )}
    </section>
  );
};

SheetView.propTypes = {
  allowClose: PropTypes.bool.isRequired,
  animationFromParent: PropTypes.shape({
    in: PropTypes.string,
    out: PropTypes.string,
  }).isRequired,
  backdrop: PropTypes.bool.isRequired,
  contentRef: PropTypes.shape().isRequired,
  duration: PropTypes.number.isRequired,
  handleSearchInput: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDidClose: PropTypes.func.isRequired,
  onDidOpen: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  onScroll: PropTypes.func.isRequired,
  scrolled: PropTypes.bool.isRequired,
  showSearch: PropTypes.bool.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

SheetView.defaultProps = {
  children: null,
  className: null,
  contentClassName: null,
  title: '',
};

/**
 * Sheet component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Sheet = ({
  allowClose,
  animation,
  backdrop,
  children: childrenProp,
  className,
  contentClassName,
  duration: sheetDuration,
  isLoading,
  isOpen: isOpenFromProps,
  onClose,
  onDidClose,
  onDidOpen,
  onOpen,
  showSearch,
  title,
}) => {
  const contentRef = useRef(null);
  const [isOpen, setIsOpen] = useState(isOpenFromProps);
  const prevIsOpenPropRef = useRef(isOpenFromProps);

  if (prevIsOpenPropRef.current !== isOpenFromProps) {
    prevIsOpenPropRef.current = isOpenFromProps;
    if (isOpen !== isOpenFromProps) {
      setIsOpen(isOpenFromProps);
    }
  }

  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');

  const handleScroll = useMemo(
    () => throttle(() => {
      const node = contentRef.current;
      if (!node) {
        return;
      }
      const nextScrolled = node.scrollTop !== 0;
      setScrolled(prev => (prev === nextScrolled ? prev : nextScrolled));
    }, 10),
    []
  );

  useEffect(() => () => {
    handleScroll.cancel();
  }, [handleScroll]);

  const handleClose = useCallback(() => {
    onClose();
    setIsOpen(false);
    setScrolled(false);
  }, [onClose]);

  const handleDidOpen = useCallback(() => {
    UIEvents.emit(SHEET_EVENTS.OPEN);
    onDidOpen();
  }, [onDidOpen]);

  const handleDidClose = useCallback(() => {
    UIEvents.emit(SHEET_EVENTS.CLOSE);
    onDidClose();
  }, [onDidClose]);

  const handleSearchInput = useCallback((value) => {
    setQuery(value);
  }, []);

  const children = React.Children.map(childrenProp, child => (
    React.cloneElement(
      child,
      typeof child.type === 'function' && onClose !== null ? {
        onClose,
        query,
      } : {}
    )
  ));

  return (
    <SheetView
      allowClose={allowClose}
      animationFromParent={animation}
      backdrop={backdrop}
      className={className}
      contentClassName={contentClassName}
      contentRef={contentRef}
      duration={sheetDuration}
      handleSearchInput={handleSearchInput}
      isLoading={isLoading}
      isOpen={isOpen}
      onClose={handleClose}
      onDidClose={handleDidClose}
      onDidOpen={handleDidOpen}
      onOpen={onOpen}
      onScroll={handleScroll}
      scrolled={scrolled}
      showSearch={showSearch}
      title={title}
    >
      {children}
    </SheetView>
  );
};

Sheet.Header = Header;

Sheet.propTypes = {
  allowClose: PropTypes.bool,
  animation: PropTypes.shape({
    in: PropTypes.string,
    out: PropTypes.string,
  }),
  backdrop: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  duration: PropTypes.number,
  isLoading: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onDidClose: PropTypes.func,
  onDidOpen: PropTypes.func,
  onOpen: PropTypes.func,
  showSearch: PropTypes.bool,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

Sheet.defaultProps = {
  animation: {},
  backdrop: true,
  children: null,
  className: null,
  contentClassName: null,
  duration: 300,
  isOpen: false,
  isLoading: false,
  onClose: () => { },
  onDidClose: () => { },
  onDidOpen: () => { },
  onOpen: () => { },
  title: '',
  showSearch: false,
  allowClose: true,
};

export default Sheet;
