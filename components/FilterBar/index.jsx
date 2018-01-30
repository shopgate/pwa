/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clamp from 'lodash/clamp';
import colors from 'Styles/colors';
import variables from 'Styles/variables';
import styles from './style';
import Content from './components/Content';
import connect from './connector';

/**
 * The Filter bar component.
 */
class FilterBar extends Component {
  static propTypes = {
    isActive: PropTypes.bool,
    viewRef: PropTypes.shape(),
  };

  static defaultProps = {
    isActive: false,
    viewRef: null,
  };

  /**
   * Constructs a new component instance.
   * @param {Object} props The component properties.
   * @param {Object} context The component context.
   */
  constructor(props) {
    super(props);

    this.element = null;
    this.scrollElement = null;
    this.animationFrameRequestId = 0;
    this.prevScrollTop = 0;
    this.isVisible = true;
    this.origin = 0;

    this.state = {
      offset: 0,
      hasShadow: false,
      spacerHeight: variables.filterbar.height,
    };
  }

  /**
   * Called after mount. Sets up the scroll DOM elements.
   */
  componentDidMount() {
    this.setupScrollElement();
    this.setSpacerHeight();
  }

  /**
   * Called before the component receives new properties. Sets up the scroll DOM elements.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.viewRef !== nextProps.viewRef) {
      this.setupScrollElement(nextProps.viewRef);
    }
  }

  /**
   * Only re-render the component when a props/state change occurs.
   * @param {Object} nextProps The next set of component props.
   * @param {Object} nextState The next state of the component.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.isActive !== nextProps.isActive ||
      this.state.offset !== nextState.offset ||
      this.state.hasShadow !== nextState.hasShadow ||
      this.state.spacerHeight !== nextState.spacerHeight
    );
  }

  /**
   * Update the spacer height if the component updates.
   */
  componentDidUpdate() {
    this.setSpacerHeight();
  }

  /**
   * Called before the component un-mounts.
   */
  componentWillUnmount() {
    this.unbindEvents();
  }

  /**
   * Returns the filter bar wrapper styles.
   * @returns {Object} The filter bar wrapper styles.
   */
  get wrapperStyle() {
    // Control the scrolling of the filter bar by applying a transform style property.
    return {
      background: (this.props.isActive) ? colors.accent : colors.background,
      color: (this.props.isActive) ? colors.accentContrast : 'inherit',
      transform: `translate3d(0, ${this.state.offset}px, 0)`,
    };
  }

  /**
   * Sets up the scroll DOM element and binds all event handlers.
   * @param {HTMLElement|null} element The element that will be scrolling.
   */
  setupScrollElement(element = this.props.viewRef) {
    if (this.scrollElement) {
      return;
    }

    this.scrollElement = element;
    this.bindEvents();
  }

  /**
   * If the bar is visible, the scrolling container requires a spacer element to prevent
   * overlapping of scrollable contents when scrolled up. This method calculates the
   * spacers total height.
   */
  setSpacerHeight = () => {
    const { element } = this;

    if (!element) {
      return;
    }

    /**
     * Wait for the next tick to be sure the component has updated when
     * this is triggered from the child components.
     */
    setTimeout(() => {
      const height = element.offsetHeight;

      if (height > 0 && height !== this.state.spacerHeight) {
        this.setState({ spacerHeight: height });
      }
    }, 100);
  }

  /**
   * Sets the reference to the DOM element.
   * @param {DOMNode} element The DOM element.
   */
  setRef = (element) => {
    this.element = element;
  };

  /**
   * Binds the DOM event handlers to the scroll element.
   */
  bindEvents() {
    if (!this.scrollElement) {
      return;
    }

    this.scrollElement.addEventListener('swipe', this.handleSwipe);
    this.animate();
  }

  /**
   * Unbinds the event handlers from the scroll element.
   */
  unbindEvents() {
    if (this.scrollElement) {
      this.scrollElement.removeEventListener('swipe', this.handleSwipe);
      cancelAnimationFrame(this.animationFrameRequestId);
    }
  }

  /**
   * Continuous animation of the filter bar.
   */
  animate = () => {
    const { scrollTop } = this.scrollElement;
    const elementHeight = this.element.offsetHeight;

    if (scrollTop <= elementHeight) {
      this.isVisible = true;
    }

    const delta = scrollTop - this.prevScrollTop;

    // Only update the state if the current scroll delta has changed.
    if (delta !== 0) {
      const { offset } = this.state;
      const nextOffset = this.isVisible
        ? clamp(offset - delta, -elementHeight, 0)
        : -elementHeight;

      if (delta < 0) {
        // Shift the origin if the scroll direction is upwards.
        this.origin = Math.min(scrollTop + nextOffset, this.origin);
      }

      if (nextOffset <= -elementHeight) {
        // Hide the component if it left the viewport.
        this.isVisible = false;
      }

      // Update the shadow state
      const hasShadow = (
        this.isVisible && this.origin + nextOffset > 0
      );

      // Update the state
      this.setState({
        offset: nextOffset,
        hasShadow,
      });

      this.prevScrollTop = scrollTop;
    }
    // Continuously call the animate() method.
    this.animationFrameRequestId = requestAnimationFrame(this.animate);
  };

  /**
   * Handles the swipe events.
   * @param {Object} event The swipe event as received from ViewContent.
   */
  handleSwipe = (event) => {
    if (this.isVisible) {
      return;
    }

    const { isFlick, y } = event.detail;

    if (!isFlick || y >= 0) {
      // Only react to flick events with a downward motion.
      return;
    }

    this.isVisible = true;
    this.origin = this.scrollElement.scrollTop;
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const classes = [
      styles.wrapper,
      ...(this.state.hasShadow) && [styles.shaded],
    ];

    return (
      <div>
        <div ref={this.setRef} className={classes.join(' ')} style={this.wrapperStyle}>
          <Content componentUpdated={this.setSpacerHeight} />
        </div>
        <div style={{ height: this.state.spacerHeight }} />
      </div>
    );
  }
}

export default connect(FilterBar);
