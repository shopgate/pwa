import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Swipeable from 'react-swipeable';
import Helmet from 'react-helmet';
import throttle from 'lodash/throttle';
import isEqual from 'lodash/isEqual';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { PAGE_ID_INDEX } from '@shopgate/pwa-common/constants/PageIDs';
import event from '@shopgate/pwa-core/classes/Event';
import { RouteContext } from '@virtuous/react-conductor/Router';
import connect from './connector';
import styles from './style';

/**
 * The view content.
 */
class ViewContent extends PureComponent {
  static propTypes = {
    setTop: PropTypes.func.isRequired,
    children: PropTypes.node,
    hasNavigator: PropTypes.bool,
    head: PropTypes.shape(),
    isFullscreen: PropTypes.bool,
    pathname: PropTypes.string,
    title: PropTypes.string,
    viewTop: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
    hasNavigator: true,
    head: {
      meta: [],
      link: [],
      script: [],
      style: [],
    },
    isFullscreen: false,
    pathname: PAGE_ID_INDEX,
    title: appConfig.shopName,
    viewTop: true,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.pathname = props.pathname;
    this.state = {
      keyboardHeight: 0,
    };

    event.addCallback('keyboardWillChange', this.handleKeyboardChange);
  }

  /**
   * Sets the navigator title when the component mounts.
   */
  componentDidMount() {
    this.props.setTop(true);
  }

  /**
   * Sets the new navigator title if it has changed.
   * @param {Object} nextProps The new component props.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.pathname !== nextProps.pathname) {
      return;
    }

    if (nextProps.viewTop && (nextProps.viewTop !== this.props.viewTop)) {
      // Scroll to top
      this.element.scrollTop = 0;
    }
  }

  /**
   * @return {string}
   */
  get contentStyle() {
    let contentStyle = styles.content(
      this.props.hasNavigator,
      this.props.isFullscreen,
      this.state.keyboardHeight
    );

    if (!this.props.viewTop) {
      contentStyle += ` ${styles.contentShaded}`;
    }

    return contentStyle;
  }

  /**
   * Creates an internal reference to an element.
   * @param {Object} ref The reference to an element.
   */
  setRef = (ref) => {
    this.element = ref;
  }

  /**
   * Handles a keyboard change event.
   * @param {boolean} open If the keyboard is now open.
   * @param {boolean} overlap The height of the keyboard.
   */
  handleKeyboardChange = ({ open, overlap }) => {
    const height = open ? overlap : 0;

    if (height !== this.state.keyboardHeight) {
      this.setState({
        keyboardHeight: height,
      });
    }
  }

  /**
   * Handles the scroll event of this component's element.
   */
  handleScroll = throttle(() => {
    if (!this.element) {
      return;
    }

    const isViewTop = (this.element.scrollTop === 0);

    if (isViewTop !== this.props.viewTop) {
      this.props.setTop(isViewTop);
    }
  }, 50);

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

    this.element.dispatchEvent(swipeEvent);
  };

  /**
   * @return {JSX}
   */
  render() {
    const { children, head } = this.props;
    const {
      meta,
      link,
      script,
      style,
    } = head;

    return (
      <Swipeable onSwiped={this.handleSwipe} flickThreshold={0.6} delta={10}>
        <article className={this.contentStyle} ref={this.setRef} onScroll={this.handleScroll}>
          <Helmet
            title={this.props.title}
            meta={meta}
            link={link}
            script={script}
            style={style}
          />
          {children}
        </article>
      </Swipeable>
    );
  }
}

export default connect(props => (
  <RouteContext.Consumer>
    {({ pathname, state }) => (
      <ViewContent
        pathname={pathname}
        title={state.title ? `${state.title} - ${appConfig.shopName}` : appConfig.shopName}
        {...props}
      />
    )}
  </RouteContext.Consumer>
));
