import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swipeable from 'react-swipeable';
import Helmet from 'react-helmet';
import appConfig from '@shopgate/pwa-common/helpers/config';
import event from '@shopgate/pwa-core/classes/Event';
import { RouteContext } from '@virtuous/react-conductor/Router';
import ViewProvider from '../../../../providers/View';
import Above from '../Above';
import Below from '../Below';
import styles from './style';

/**
 * The ViewContent component.
 */
class ViewContent extends Component {
  static propTypes = {
    children: PropTypes.node,
    hasNavigator: PropTypes.bool,
    isFullscreen: PropTypes.bool,
    title: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    hasNavigator: true,
    isFullscreen: false,
    title: appConfig.shopName,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.element = React.createRef();
    this.state = {
      keyboardHeight: 0,
    };

    event.addCallback('keyboardWillChange', this.handleKeyboardChange);
  }

  /**
   * @return {string}
   */
  get contentStyle() {
    return styles.content(
      this.props.hasNavigator,
      this.props.isFullscreen,
      this.state.keyboardHeight
    );
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

    this.element.current.dispatchEvent(swipeEvent);
  };

  /**
   * @return {JSX}
   */
  render() {
    return (
      <Swipeable onSwiped={this.handleSwipe} flickThreshold={0.6} delta={10}>
        <ViewProvider>
          <article className={this.contentStyle} ref={this.element}>
            <Helmet title={this.props.title} />
            <Above />
            {this.props.children}
            <Below />
          </article>
        </ViewProvider>
      </Swipeable>
    );
  }
}

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ViewContentConsumer = props => (
  <RouteContext.Consumer>
    {({ state }) => (
      <ViewContent {...props} title={state.title ? `${state.title} - ${appConfig.shopName}` : appConfig.shopName} />
    )}
  </RouteContext.Consumer>
);

export default ViewContentConsumer;
