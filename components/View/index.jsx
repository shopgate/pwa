/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Swipeable from 'react-swipeable';
import throttle from 'lodash/throttle';
import { shopName } from 'Config/app.json';
import connect from './connector';
import styles from './style';

/**
 * The view component.
 */
class View extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    setTitle: PropTypes.func.isRequired,
    setTop: PropTypes.func.isRequired,
    hasNavigator: PropTypes.bool,
    head: PropTypes.shape({
      meta: PropTypes.array,
      link: PropTypes.array,
      script: PropTypes.array,
      style: PropTypes.array,
    }),
    style: PropTypes.shape(),
    title: PropTypes.string,
    viewTop: PropTypes.bool,
  };

  static defaultProps = {
    hasNavigator: true,
    head: {
      meta: [],
      link: [],
      script: [],
      style: [],
    },
    style: null,
    title: '',
    viewTop: true,
  };

  static childContextTypes = {
    viewRef: PropTypes.shape(),
  };

  /**
   * The component constructor
   * @param {Object} props The component props
   */
  constructor(props) {
    super(props);

    this.element = null;
  }

  /**
   * Forwards the current route path to the child context.
   * @return {Object} The child context.
   */
  getChildContext() {
    return {
      viewRef: this.element,
    };
  }

  /**
   * Sets the navigator title when the component mounts.
   */
  componentDidMount() {
    this.props.setTitle(this.title);
    this.props.setTop(true);
  }

  /**
   * Sets the new navigator title if it has changed.
   * @param {Object} nextProps The new component props.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.title !== this.props.title) {
      this.props.setTitle(nextProps.title || this.title);
    }

    if (nextProps.viewTop && nextProps.viewTop !== this.props.viewTop) {
      // Scroll to top
      this.element.scrollTop = 0;
    }
  }

  /**
   * Creates an internal reference to an element.
   * @param {Object} ref The reference to an element.
   */
  setRef = (ref) => {
    this.element = ref;
  }

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
  }, 5);

  /**
   * Returns the view title.
   * @returns {string}
   */
  get title() {
    return this.props.title || '';
  }

  /**
   * Handles the swipe down gesture.
   * @param {Object} event The event object.
   * @param {number} x The change on the x axis.
   * @param {number} y The change on the y axis.
   * @param {boolean} isFlick Whether this is a flick or swipe.
   * @param {number} velocity The velocity of the gesture.
   */
  handleSwipe = (event, x, y, isFlick, velocity) => {
    const swipeEvent = new CustomEvent('swipe', {
      detail: {
        event,
        x,
        y,
        isFlick,
        velocity,
      },
    });

    this.element.dispatchEvent(swipeEvent);
  };

  /**
   * Sets the navigator title when the component mounts.
   */
  routeWillEnter() {
    this.props.setTitle(this.title);
  }

  /**
   * Renders the HTML meta tags.
   * @returns {JSX}
   */
  renderMetaTags() {
    const { meta, link, script, style } = this.props.head;

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
    let contentStyle = styles.content(this.props.hasNavigator);

    if (!this.props.viewTop) {
      contentStyle += ` ${styles.contentShaded}`;
    }

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
            {this.props.children}
          </article>
        </Swipeable>
      </section>
    );
  }
}

export default connect(View);
