import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Swipeable from 'react-swipeable';
import throttle from 'lodash/throttle';
import event from '@shopgate/pwa-core/classes/Event';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import { EVENT_KEYBOARD_WILL_CHANGE } from '@shopgate/pwa-core/constants/AppEvents';
import { shopName } from 'Config/app.json';
import connect from './connector';
import styles from './style';

const SCROLL_DEBOUNCE = 50;

/**
 * The view component.
 */
class View extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    historyPathname: PropTypes.string.isRequired,
    navigatorTitle: PropTypes.string.isRequired,
    setTitle: PropTypes.func.isRequired,
    setTop: PropTypes.func.isRequired,
    considerPaddingTop: PropTypes.bool,
    hasNavigator: PropTypes.bool,
    hasTabBar: PropTypes.bool,
    head: PropTypes.shape({
      meta: PropTypes.array,
      link: PropTypes.array,
      script: PropTypes.array,
      style: PropTypes.array,
    }),
    isFullscreen: PropTypes.bool,
    noScrollOnKeyboard: PropTypes.bool,
    style: PropTypes.shape(),
    title: PropTypes.string,
    viewTop: PropTypes.bool,
  };

  static defaultProps = {
    considerPaddingTop: false,
    hasNavigator: true,
    hasTabBar: true,
    head: {
      meta: [],
      link: [],
      script: [],
      style: [],
    },
    isFullscreen: false,
    noScrollOnKeyboard: false,
    style: null,
    title: '',
    viewTop: true,
  };

  static contextTypes = {
    routePath: PropTypes.string,
  };

  /**
   * The component constructor
   * @param {Object} props The component props
   * @param {Object} context The component context
   */
  constructor(props, context) {
    super(props);

    // Store the active pathname at instantiation
    this.pathname = context.routePath;
    this.element = null;

    this.state = {
      noScroll: false,
    };
  }

  /**
   * Sets the navigator title when the component mounts.
   */
  componentDidMount() {
    // If we already know the page title then we can set it immediately.
    if (this.props.title !== null) {
      this.props.setTitle(this.props.title);
    }

    this.props.setTop(true);

    if (this.props.noScrollOnKeyboard) {
      registerEvents([EVENT_KEYBOARD_WILL_CHANGE]);
      this.bindKeyboardChange();
    }
  }

  /**
   * Sets the new navigator title if it has changed.
   * @param {Object} nextProps The new component props.
   */
  componentWillReceiveProps(nextProps) {
    // Only update if the active pathname is the same as the pathname of this route.
    if (nextProps.historyPathname !== this.pathname) {
      return;
    }

    if (
      (nextProps.title !== this.props.title) ||
      (this.props.navigatorTitle !== nextProps.title)
    ) {
      // Update the title if it is different from the set navigator title.
      this.props.setTitle(nextProps.title || this.props.title);
    }

    if (nextProps.viewTop && (nextProps.viewTop !== this.props.viewTop)) {
      // Scroll to top
      this.element.scrollTop = 0;
    }
  }

  /**
   * Unbinds keyboard listener
   */
  componentWillUnmount() {
    if (this.props.noScrollOnKeyboard) {
      this.unbindKeyboardChange();
    }
  }

  /**
   * Creates an internal reference to an element.
   * @param {Object} ref The reference to an element.
   */
  setRef = (ref) => {
    this.element = ref;
  };

  /**
   * Adds keyboardWillChangeListener.
   */
  bindKeyboardChange() {
    event.addCallback(EVENT_KEYBOARD_WILL_CHANGE, this.handleKeyboardChange);
  }

  /**
   * Removed keyboardWillChange listener.
   */
  unbindKeyboardChange() {
    event.removeCallback(EVENT_KEYBOARD_WILL_CHANGE, this.handleKeyboardChange);
  }

  /**
   * Keyboard will change callback.
   * @param {Object} params Event params.
   * @param { boolean } open If the keyboard is now open.
   */
  handleKeyboardChange = ({ open }) => {
    this.setState({
      noScroll: open,
    });
  };

  /**
   * Handles the scroll event of this component's element.
   */
  handleScroll = throttle(() => {
    if (!this.element) {
      return;
    }

    const isViewTop = this.element.scrollTop === 0;

    if (isViewTop !== this.props.viewTop) {
      this.props.setTop(isViewTop);
    }
  }, SCROLL_DEBOUNCE);

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
        e,
        x,
        y,
        isFlick,
        velocity,
      },
    });

    this.element.dispatchEvent(swipeEvent);
  };

  /**
   * Renders the HTML meta tags.
   * @returns {JSX}
   */
  renderMetaTags() {
    const {
      meta, link, script, style,
    } = this.props.head;

    return (
      <Helmet
        title={this.props.title ? `${this.props.title} - ${shopName}` : shopName}
        meta={meta}
        link={link}
        script={script}
        style={style}
      />
    );
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const contentStyle = styles.content(
      this.props.hasNavigator,
      this.props.isFullscreen,
      this.props.considerPaddingTop && this.props.hasTabBar,
      this.state.noScroll
    );

    const { children } = this.props;

    return (
      <section className={styles.container} style={this.props.style}>
        <Swipeable
          onSwiped={this.handleSwipe}
          flickThreshold={0.6}
          delta={10}
        >
          <article
            className={contentStyle}
            ref={this.setRef}
            onScroll={this.handleScroll}
          >
            {this.renderMetaTags()}
            {React.Children.map(children, (child) => {
              /**
               * Inject a viewRef prop into all of the children
               * to give them access to the <article> ref.
               */
              if (!child) {
                return null;
              }

              // Just return the child if it is not a React component.
              if (typeof child.type === 'string') {
                return child;
              }

              return React.cloneElement(child, {
                ...this.element && { viewRef: this.element },
              });
            })}
          </article>
        </Swipeable>
      </section>
    );
  }
}

export default connect(View);
