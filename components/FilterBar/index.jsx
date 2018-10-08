import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import colors from 'Styles/colors';
import Content from './components/Content';
import styles from './style';
import transition from './transition';
import { ViewContext } from '../View/context';

/**
 * The FilterBar component.
 */
class FilterBar extends Component {
  static propTypes = {
    filters: PropTypes.shape(),
  };

  static defaultProps = {
    filters: null,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.node = React.createRef();
    this.state = {
      active: props.filters !== null,
      shadow: false,
      visible: true,
    };
  }

  /**
   * Sets up the scroll DOM elements.
   */
  componentDidMount() {
    this.setScrollListener(this.props.viewRef);
  }

  /**
   * Check for a new viewRef and update the scroll element.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    // Check if a new viewRef came in.
    const hasNewRef = (!this.props.viewRef && nextProps.viewRef);

    // Chcek if newly set filters came in.
    const hasFilters = nextProps.filters !== null && Object.keys(nextProps.filters).length > 0;

    if (hasNewRef) {
      this.setScrollListener(nextProps.viewRef);
    }

    console.warn(this.node.current.clientHeight, nextProps.offsetY);

    // this.setState({
    //   active: hasFilters,
    //   visible: (nextProps.offsetY < this.props.offsetY) || (nextProps.offsetY <= this.node.clientHeight),
    // });
  }

  /**
   * Only re-render the component when there is a state change.
   * @param {Object} nextProps The next set of component props.
   * @param {Object} nextState The next state of the component.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return true;
    return (
      this.state.active !== nextState.active ||
      this.state.shadow !== nextState.shadow ||
      this.state.visible !== nextState.visible
    );
  }

  /**
   * Unbinds the event handlers from the scroll element.
   */
  componentWillUnmount() {
    // const { viewRef } = this.props;

    // if (viewRef.current) {
    //   viewRef.current.removeEventListener('swipe', this.handleSwipe);
    // }
  }

  /**
   * @returns {Object}
   */
  get style() {
    const { active } = this.state;
    return {
      background: active ? colors.accent : colors.background,
      color: active ? colors.accentContrast : 'inherit',
    };
  }

  /**
   * Binds an event handler to the received props.viewRef.
   * @param {HTMLElement|null} node The node that will be scrolling.
   */
  setScrollListener(node) {
    if (!node || !node.current) {
      return;
    }

    node.current.addEventListener('swipe', this.handleSwipe);
  }

  /**
   * @param {CustomEvent} event The swipe event.
   */
  handleSwipe = (event) => {
    if (!this.node) {
      return;
    }

    // Hide when we scrolled down further that the height of the bar.
    if (event.detail.y > this.node.current.clientHeight) {
      this.setState({ visible: false });
    // Show when we scrolled up further up a little
    } else if (event.detail.y < -24) {
      this.setState({ visible: true });
    }
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <section className={styles.container}>
        <Transition in={this.state.visible} timeout={200}>
          {state => (
            <div
              className={styles.wrapper}
              data-test-id="filterBar"
              ref={this.node}
              style={{
                ...this.style,
                ...transition[state],
              }}
            >
              <Content />
            </div>
          )}
        </Transition>
      </section>
    );
  }
}

export default props => (
  <ViewContext.Consumer>
    {({ scrollOffsetY }) => <FilterBar {...props} offsetY={scrollOffsetY || 0} />}
  </ViewContext.Consumer>
);
