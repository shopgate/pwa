import React, { Component } from 'react';
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
import { useScrollContainer, isIOs } from '@shopgate/engage/core/helpers';
import { ParallaxProvider } from 'react-scroll-parallax';
import { ConditionalWrapper } from '../../../ConditionalWrapper';
import Above from '../Above';
import Below from '../Below';
import { container, containerInner } from './style';
import ParallaxUpdater from './components/ParallaxUpdater';

/**
 * The ViewContent component.
 */
class ViewContent extends Component {
  static contextType = RouteContext;

  static propTypes = {
    setContentRef: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    noContentPortal: PropTypes.bool,
    noKeyboardListener: PropTypes.bool,
    noScrollOnKeyboard: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    children: null,
    noScrollOnKeyboard: false,
    noContentPortal: false,
    noKeyboardListener: false,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.ref = React.createRef();
    this.scrollContainerInner = React.createRef();
    this.state = {
      keyboardHeight: 0,
      isInputFocused: false,
      scrollHeight: 0,
    };

    this.scrollContainer = useScrollContainer();

    if (!this.scrollContainer) {
      this.ref.current = window;
    }

    this.props.setContentRef(this.ref);

    event.addCallback(EVENT_KEYBOARD_WILL_CHANGE, this.handleKeyboardChange);

    if (isIOs) {
      window.addEventListener('focusin', this.handleInputFocusChange);
      window.addEventListener('focusout', this.handleInputFocusChange);
    }
  }

  /**
   * @param {Object} props The component props.
   * @param {Object} state The component state.
   * @returns {Object}
   */
  static getDerivedStateFromProps(props, state) {
    if (props.visible || state.keyboardHeight === 0) {
      return null;
    }

    return { keyboardHeight: 0 };
  }

  /**
   * Restore the scroll position of the page.
   */
  componentDidMount() {
    const { scrollTop } = this.context.state;

    // This trick ensures the scroll position is restored correctly. Without it there where
    // situations where scroll position was restored before the content was rendered.
    // In that case restoration didn't have any effect.
    window.requestAnimationFrame(() => {
      if (this.ref.current === window) {
        window.scrollTo(0, scrollTop || 0);
      } else {
        this.ref.current.scrollTop = scrollTop;
      }
    });

    const containerElement = this.scrollContainerInner.current;
    const myObserver = new ResizeObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry) {
        this.setState({
          scrollHeight: firstEntry.contentRect.height,
        });
      }
    });

    if (containerElement) {
      myObserver.observe(containerElement);
    }
  }

  /**
   * Removes the keyboardWillChange listener.
   */
  componentWillUnmount() {
    let scrollTop;

    if (this.ref.current === window) {
      scrollTop = window.scrollY;
    } else {
      ({ scrollTop } = this.ref.current);
    }

    router.update(this.context.id, {
      scrollTop,
    }, false);

    event.removeCallback(EVENT_KEYBOARD_WILL_CHANGE, this.handleKeyboardChange);

    if (isIOs) {
      window.removeEventListener('focusin', this.handleInputFocusChange);
      window.removeEventListener('focusout', this.handleInputFocusChange);
    }
  }

  /**
   * @returns {Object}
   */
  get style() {
    const { noScrollOnKeyboard } = this.props;
    const { keyboardHeight, isInputFocused } = this.state;

    let overflow = 'inherit';

    if (this.scrollContainer) {
      overflow = (noScrollOnKeyboard && keyboardHeight > 0) ? 'hidden' : 'auto';
    }

    return {
      '--keyboard-height': `${keyboardHeight}px`,
      // Used on iOS devices to make the scroll container content always a bit taller than the
      // scroll container to enforce rubber band effect. Needs to be deactivated when input
      // is focused to prevent side effects (multiple scrollable content areas).
      '--extra-ios-scroll-space': isInputFocused ? 0 : '12px',
      overflow,
    };
  }

  /**
   * Handles focus changes on the window to detect if an input is focused.
   * @param {FocusEvent} e The event payload
   */
  handleInputFocusChange = (e) => {
    const el = e.target;
    const isInputTarget =
      (el.tagName === 'INPUT' &&
        ['text', 'password', 'email', 'number', 'search', 'tel', 'url'].includes(
          el.type
        )) ||
      el.tagName === 'TEXTAREA' ||
      el.isContentEditable;

    if (isInputTarget) {
      this.setState({
        isInputFocused: e.type === 'focusin',
      });
    }
  };

  /**
   * Handles a keyboard change event.
   * @param {boolean} open If the keyboard is now open.
   * @param {boolean} overlap The height of the keyboard.
   */
  handleKeyboardChange = ({ open, overlap }) => {
    if (this.props.noKeyboardListener) {
      return;
    }

    const height = (open) ? overlap : 0;

    if (this.props.visible && height !== this.state.keyboardHeight) {
      this.setState({
        keyboardHeight: height,
      });
    }
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    return (
      <article
        className={`${container} engage__view__content ${this.props.className}`}
        ref={this.scrollContainer ? this.ref : null}
        style={this.style}
        role="none"
      >
        <ParallaxProvider scrollContainer={this.ref.current}>
          <ParallaxUpdater scrollHeight={this.state.scrollHeight} />
          <div className={containerInner} ref={this.scrollContainerInner}>
            <Helmet title={appConfig.shopName} />
            <Above />
            <ResponsiveContainer breakpoint=">xs" webOnly>
              {this.props.visible ? (
                <div id="PageHeaderBelow" />
              ) : null}
            </ResponsiveContainer>
            <ConditionalWrapper
              condition={!this.props.noContentPortal}
              wrapper={children =>
                <SurroundPortals portalName={VIEW_CONTENT}>
                  {children}
                </SurroundPortals>}
            >
              {this.props.children}
            </ConditionalWrapper>
            <Below />
          </div>

        </ParallaxProvider>
      </article>
    );
  }
}

export default props => (
  <RouteContext.Consumer>
    {({ visible, pattern = '', is404 = false }) => (
      <ViewContent {...props} visible={visible} className={`route_${is404 ? '404' : pattern.replace(/[:/]/g, '_')}`} />
    )}
  </RouteContext.Consumer>
);
