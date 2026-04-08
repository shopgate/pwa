import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import ResponsiveContainer from '@shopgate/engage/components/ResponsiveContainer';
import appConfig from '@shopgate/pwa-common/helpers/config';
import event from '@shopgate/pwa-core/classes/Event';
import { router } from '@virtuous/conductor';
import { RouteContext } from '@shopgate/pwa-common/context';
import { EVENT_KEYBOARD_WILL_CHANGE } from '@shopgate/pwa-core/constants/AppEvents';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { VIEW_CONTENT } from '@shopgate/pwa-common/constants/Portals';
import { applyScrollContainer, isIOs } from '@shopgate/engage/core/helpers';
import { makeStyles, cx, responsiveMediaQuery } from '@shopgate/engage/styles';
import { IS_PAGE_PREVIEW_ACTIVE } from '@shopgate/engage/page/constants';
import { ConditionalWrapper } from '../../../ConditionalWrapper';
import Above from '../Above';
import Below from '../Below';
import ParallaxProvider from './components/ParallaxProvider';

const useStyles = makeStyles()({
  containerBase: {
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      width: 'var(--page-content-width)',
    },
  },
  containerScroll: {
    bottom: 0,
    top: 0,
    overflowScrolling: 'touch',
    position: 'absolute',
    WebkitOverflowScrolling: 'touch',
    ...(IS_PAGE_PREVIEW_ACTIVE && {
      scrollbarWidth: 'thin',
      backgroundColor: 'var(--page-background-color)',
    }),
  },
  containerWindow: {
    height: '100%',
    backgroundColor: 'var(--page-background-color)',
  },
  containerInner: {
    ':after': {
      content: "''",
      display: 'block',
      pointerEvents: 'none',
      paddingBottom: 'calc(var(--page-content-offset-bottom) + var(--keyboard-height))',
    },
  },
  containerInnerIosScroll: {
    minHeight: 'calc(100% + var(--extra-ios-scroll-space, 0px))',
  },
});

/**
 * The ViewContent component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const ViewContent = ({
  setContentRef,
  visible,
  children,
  className,
  noContentPortal,
  noKeyboardListener,
  noScrollOnKeyboard,
}) => {
  const routeContext = useContext(RouteContext);
  const scrollContainer = applyScrollContainer();
  const { classes } = useStyles();

  const ref = useRef((() => {
    if (scrollContainer) {
      return null;
    }
    if (typeof window !== 'undefined') {
      return window;
    }
    return null;
  })());

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useLayoutEffect(() => {
    setContentRef(ref);
  }, [setContentRef]);

  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
    }
  }, [visible]);

  useLayoutEffect(() => {
    const { scrollTop } = routeContext.state;
    const raf = window.requestAnimationFrame(() => {
      if (ref.current === window) {
        window.scrollTo(0, scrollTop || 0);
      } else if (ref.current?.scrollTop !== undefined) {
        ref.current.scrollTop = scrollTop || 0;
      }
    });
    return () => window.cancelAnimationFrame(raf);
  // Restore scroll once on mount (matches former componentDidMount).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputFocusChange = useCallback((e) => {
    const el = e.target;
    const isInputTarget =
      (el.tagName === 'INPUT' &&
        ['text', 'password', 'email', 'number', 'search', 'tel', 'url'].includes(
          el.type
        )) ||
      el.tagName === 'TEXTAREA' ||
      el.isContentEditable;

    if (isInputTarget) {
      setIsInputFocused(e.type === 'focusin');
    }
  }, []);

  const handleKeyboardChange = useCallback(({ open, overlap }) => {
    if (noKeyboardListener) {
      return;
    }
    const height = open ? overlap : 0;
    if (visible && height !== keyboardHeight) {
      setKeyboardHeight(height);
    }
  }, [noKeyboardListener, visible, keyboardHeight]);

  useLayoutEffect(() => {
    event.addCallback(EVENT_KEYBOARD_WILL_CHANGE, handleKeyboardChange);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const node = ref.current;
      let scrollTop;
      if (node === window) {
        scrollTop = window.scrollY;
      } else if (node) {
        ({ scrollTop } = node);
      }
      router.update(routeContext.id, {
        scrollTop,
      }, false);

      event.removeCallback(EVENT_KEYBOARD_WILL_CHANGE, handleKeyboardChange);
    };
  }, [handleKeyboardChange, routeContext.id]);

  useEffect(() => {
    if (!isIOs) {
      return undefined;
    }
    window.addEventListener('focusin', handleInputFocusChange);
    window.addEventListener('focusout', handleInputFocusChange);
    return () => {
      window.removeEventListener('focusin', handleInputFocusChange);
      window.removeEventListener('focusout', handleInputFocusChange);
    };
  }, [handleInputFocusChange]);

  let overflow = 'inherit';
  if (scrollContainer) {
    overflow = (noScrollOnKeyboard && keyboardHeight > 0) ? 'hidden' : 'auto';
  }

  const style = {
    '--keyboard-height': `${keyboardHeight}px`,
    '--extra-ios-scroll-space': isInputFocused ? 0 : '12px',
    overflow,
  };

  return (
    <ParallaxProvider viewVisible={visible}>
      <article
        className={cx(
          classes.containerBase,
          scrollContainer ? classes.containerScroll : classes.containerWindow,
          'engage__view__content',
          className
        )}
        ref={scrollContainer ? ref : null}
        style={style}
        role="none"
      >
        <div
          className={cx(
            classes.containerInner,
            isIOs && scrollContainer && classes.containerInnerIosScroll
          )}
        >
          <div className="engage__view__content__scrollable-content">
            <Helmet title={appConfig.shopName} />
            <Above />
            <ResponsiveContainer breakpoint=">xs" webOnly>
              {visible ? (
                <div id="PageHeaderBelow" />
              ) : null}
            </ResponsiveContainer>
            <ConditionalWrapper
              condition={!noContentPortal}
              wrapper={portalChildren => (
                <SurroundPortals portalName={VIEW_CONTENT}>
                  {portalChildren}
                </SurroundPortals>
              )}
            >
              {children}
            </ConditionalWrapper>
            <Below />
          </div>
        </div>
      </article>
    </ParallaxProvider>
  );
};

ViewContent.propTypes = {
  setContentRef: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  noContentPortal: PropTypes.bool,
  noKeyboardListener: PropTypes.bool,
  noScrollOnKeyboard: PropTypes.bool,
};

ViewContent.defaultProps = {
  className: '',
  children: null,
  noScrollOnKeyboard: false,
  noContentPortal: false,
  noKeyboardListener: false,
};

export default props => (
  <RouteContext.Consumer>
    {({ visible, pattern = '', is404 = false }) => (
      <ViewContent
        {...props}
        visible={visible}
        className={`route_${is404 ? '404' : pattern.replace(/[:/]/g, '_')}`}
      />
    )}
  </RouteContext.Consumer>
);
