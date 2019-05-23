import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swipeable from 'react-swipeable';
import Helmet from 'react-helmet';
import { router } from '@virtuous/conductor';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  event,
  RouteContext,
  EVENT_KEYBOARD_WILL_CHANGE,
  VIEW_CONTENT,
} from '@shopgate/engage/core';
import { SurroundPortals } from '@shopgate/engage/components';
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
    children: PropTypes.node,
    noScrollOnKeyboard: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
    noScrollOnKeyboard: false,
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

    this.props.setContentRef(this.ref);

    event.addCallback(EVENT_KEYBOARD_WILL_CHANGE, this.handleKeyboardChange);
  }

  /**
   * Restore the scroll position of the page.
   */
  componentDidMount() {
    this.ref.current.scrollTop = this.context.state.scrollTop;
  }

  /**
   * Removes the keyboardWillChange listener.
   */
  componentWillUnmount() {
    event.removeCallback(EVENT_KEYBOARD_WILL_CHANGE, this.handleKeyboardChange);

    router.update(this.context.id, {
      scrollTop: this.ref.current.scrollTop,
    }, false);
  }

  /**
   * @returns {Object}
   */
  get style() {
    const { noScrollOnKeyboard } = this.props;
    const { keyboardHeight } = this.state;

    return {
      overflow: (noScrollOnKeyboard && keyboardHeight > 0) ? 'hidden' : 'auto',
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

    if (height !== this.state.keyboardHeight) {
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
        <article className={styles} ref={this.ref} style={this.style}>
          <Helmet title={appConfig.shopName} />
          <Above />
          <SurroundPortals portalName={VIEW_CONTENT}>
            {this.props.children}
          </SurroundPortals>
          <Below />
        </article>
      </Swipeable>
    );
  }
}

export default ViewContent;
