import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { RouteContext } from '@shopgate/pwa-common/context';
import { setPageBackgroundColor } from '../../styles';
import Content from './components/Content';
import ViewProvider from './provider';
import { ViewContext } from './context';
import styles from './style';

const { colors } = themeConfig;

// Duration of the opacity crossfade between routed views (keep in sync with the transition below).
const FADE_DURATION = 350;

// api: import { ViewContext } from '@shopgate/engage/components/View';
export { ViewContext };

/**
 * The View container component.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
function ViewContainer({
  background,
  children,
  noScrollOnKeyboard,
  visible,
  'aria-hidden': ariaHidden,
  noContentPortal,
  noKeyboardListener,
}) {
  if (visible) {
    setPageBackgroundColor(background);
  }

  // Keeps the element in layout (display:flex) while it fades out, then drops it once invisible.
  const [rendered, setRendered] = useState(visible);
  const hideTimeout = useRef(null);

  useEffect(() => {
    if (visible) {
      // Becoming visible: cancel any pending hide and re-enter layout immediately.
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
      setRendered(true);
    } else if (rendered && !hideTimeout.current) {
      // Becoming invisible: keep rendered for the fade-out, then drop from layout.
      hideTimeout.current = setTimeout(() => {
        hideTimeout.current = null;
        setRendered(false);
      }, FADE_DURATION);
    }
  }, [visible, rendered]);

  // Clear any pending timer on unmount to avoid leaks / setState after unmount.
  useEffect(() => () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  }, []);

  const style = {
    display: visible || rendered ? 'flex' : 'none',
    opacity: visible ? 1 : 0,
    transition: `opacity ${FADE_DURATION}ms ease`,
    pointerEvents: visible ? 'auto' : 'none',
  };

  return (
    <ViewProvider>
      <ViewContext.Consumer>
        {({ setContentRef, ariaHidden: ariaHiddenContext }) => (
          <section className={`${styles} engage__view`} style={style} aria-hidden={ariaHidden || ariaHiddenContext}>
            <Content
              noScrollOnKeyboard={noScrollOnKeyboard}
              noKeyboardListener={noKeyboardListener}
              setContentRef={setContentRef}
              noContentPortal={noContentPortal}
            >
              {children}
            </Content>
          </section>
        )}
      </ViewContext.Consumer>
    </ViewProvider>
  );
}

ViewContainer.propTypes = {
  visible: PropTypes.bool.isRequired,
  'aria-hidden': PropTypes.bool,
  background: PropTypes.string,
  children: PropTypes.node,
  noContentPortal: PropTypes.bool,
  noKeyboardListener: PropTypes.bool,
  noScrollOnKeyboard: PropTypes.bool,
};

ViewContainer.defaultProps = {
  'aria-hidden': false,
  background: colors.light,
  children: null,
  noScrollOnKeyboard: false,
  noContentPortal: false,
  noKeyboardListener: false,
};

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
export default function View(props) {
  return (
    <RouteContext.Consumer>
      {({ visible }) => (
        <ViewContainer {...props} visible={visible} />
      )}
    </RouteContext.Consumer>
  );
}
