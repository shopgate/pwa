import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swipeable from 'react-swipeable';
import Helmet from 'react-helmet';
import ResponsiveContainer from '@shopgate/engage/components/ResponsiveContainer';
import appConfig from '@shopgate/pwa-common/helpers/config';
import event from '@shopgate/pwa-core/classes/Event';
import { router } from '@virtuous/conductor';
import { RouteContext } from '@shopgate/pwa-common/context';
import { EVENT_KEYBOARD_WILL_CHANGE } from '@shopgate/pwa-core/constants/AppEvents';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { VIEW_CONTENT } from '@shopgate/pwa-common/constants/Portals';
import { useScrollContainer } from '@shopgate/engage/core';
import { ConditionalWrapper } from '../../../ConditionalWrapper';
import Above from '../Above';
import Below from '../Below';
import styles from './style';

/**
 * The ViewContent component.
 */
class ViewContent extends Component {
  static contextType = RouteContext;

  static propTypes = {
    setContentRef: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    children: PropTypes.node,
    noContentPortal: PropTypes.bool,
    noScrollOnKeyboard: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
    noScrollOnKeyboard: false,
    noContentPortal: false,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.ref = React.createRef();
    this.state = {
      keyboardHeight: 0,
    };

    this.scrollContainer = useScrollContainer();

    if (!this.scrollContainer) {
      this.ref.current = window;
    }

    this.props.setContentRef(this.ref);

    event.addCallback(EVENT_KEYBOARD_WILL_CHANGE, this.handleKeyboardChange);
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

    if (this.ref.current === window) {
      window.scrollTo(0, scrollTop || 0);
    } else {
      this.ref.current.scrollTop = scrollTop;
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
      (scrollTop = this.ref.current);
    }

    router.update(this.context.id, {
      scrollTop,
    }, false);

    event.removeCallback(EVENT_KEYBOARD_WILL_CHANGE, this.handleKeyboardChange);
  }

  /**
   * @returns {Object}
   */
  get style() {
    const { noScrollOnKeyboard } = this.props;
    const { keyboardHeight } = this.state;

    let overflow = 'inherit';

    if (this.scrollContainer) {
      overflow = (noScrollOnKeyboard && keyboardHeight > 0) ? 'hidden' : 'auto';
    }

    return {
      overflow,
      paddingBottom: keyboardHeight,
    };
  }

  /**
   * Handles a keyboard change event.
   * @param {boolean} open If the keyboard is now open.
   * @param {boolean} overlap The height of the keyboard.
   */
  handleKeyboardChange = ({ open, overlap }) => {
    const height = (open) ? overlap : 0;

    if (this.props.visible && height !== this.state.keyboardHeight) {
      this.setState({
        keyboardHeight: height,
      });
    }
  }

  /**
   * Handles the swipe down gesture.
   * @param {Object} e The event object.
   * @param {number} x The change on the x axis.
   * @param {number} y The change on the y axis.
   * @param {boolean} isFlick Whether this is a flick or swipe.
   * @param {number} velocity The velocity of the gesture.
   */
  handleSwipe = (e, x, y, isFlick, velocity) => {
    const swipeEvent = new CustomEvent('swipe', {
      detail: {
        event: e,
        x,
        y,
        isFlick,
        velocity,
      },
    });

    this.ref.current.dispatchEvent(swipeEvent);
  };

  /**
   * @return {JSX}
   */
  render() {
    return (
      <Swipeable onSwiped={this.handleSwipe} flickThreshold={0.6} delta={10}>
        <article className={styles} ref={this.scrollContainer ? this.ref : null} style={this.style}>
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
              </SurroundPortals>
            }
          >
            {this.props.children}
          </ConditionalWrapper>
          <Below />
        </article>
      </Swipeable>
    );
  }
}

export default props => (
  <RouteContext.Consumer>
    {({ visible }) => <ViewContent {...props} visible={visible} />}
  </RouteContext.Consumer>
);
