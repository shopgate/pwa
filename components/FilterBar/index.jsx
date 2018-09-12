import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import classNames from 'classnames';
import { UIEvents } from '@shopgate/pwa-core';
import colors from 'Styles/colors';
import Content from './components/Content';
import styles from './style';
import transition from './transition';
import { FILTERBAR_UPDATE } from './constants';

/**
 * The FilterBar component.
 */
class FilterBar extends Component {
  static propTypes = {
    setTop: PropTypes.func.isRequired,
    filters: PropTypes.shape(),
    viewRef: PropTypes.shape(),
  };

  static defaultProps = {
    filters: null,
    viewRef: null,
  };

  /**
   * Constructs a new component instance.
   * @param {Object} props The component properties.
   */
  constructor(props) {
    super(props);

    this.node = React.createRef();
    this.state = {
      active: props.filters !== null,
      shadow: false,
      visible: true,
    };

    UIEvents.addListener(FILTERBAR_UPDATE, this.updateView);
  }

  /**
   * Sets up the scroll DOM elements.
   */
  componentDidMount() {
    this.updateView();
    this.setScrollListener();
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
      this.updateView();
      this.setScrollListener(nextProps.viewRef);
    }

    if (hasFilters !== this.state.active) {
      this.setState({ active: hasFilters });
    }
  }

  /**
   * Only re-render the component when there is a state change.
   * @param {Object} nextProps The next set of component props.
   * @param {Object} nextState The next state of the component.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.active !== nextState.active ||
      this.state.shadow !== nextState.shadow ||
      this.state.visible !== nextState.visible
    );
  }

  /**
   * Set the top value of the View when the component updates.
   */
  componentDidUpdate() {
    this.updateView();
  }

  /**
   * Unbinds the event handlers from the scroll element.
   */
  componentWillUnmount() {
    const { viewRef } = this.props;

    if (viewRef.current) {
      viewRef.current.removeEventListener('swipe', this.handleSwipe);
    }
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
  setScrollListener(node = this.props.viewRef) {
    if (!node) {
      return;
    }

    node.current.addEventListener('swipe', this.handleSwipe);
  }

  /**
   * Update the ViewProvider with the height of the bar.
   */
  updateView = () => {
    if (!this.node.current) {
      return;
    }

    this.props.setTop(this.node.current.clientHeight);
  }

  /**
   * @param {CustomEvent} event The swipe event.
   */
  handleSwipe = (event) => {
    // Display a shadow if we are scrolled at all.
    const shadow = event.target.scrollTop > 0;

    if (!this.node) {
      return;
    }

    // Hide when we scrolled down further that the height of the bar.
    if (event.detail.y > this.node.current.clientHeight) {
      this.setState({
        shadow,
        visible: false,
      });
    // Show when we scrolled up further up a little
    } else if (event.detail.y < -24) {
      this.setState({
        shadow,
        visible: true,
      });
    }
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const classes = classNames(
      styles.wrapper,
      { [styles.shaded]: this.state.shadow }
    );

    return (
      <section className={styles.container}>
        <Transition in={this.state.visible} timeout={200}>
          {state => (
            <div
              className={classes}
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

export default FilterBar;
