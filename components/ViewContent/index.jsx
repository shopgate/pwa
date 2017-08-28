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
 * The view content component.
 */
class ViewContent extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    hasNavigator: PropTypes.bool,
    head: PropTypes.shape({
      meta: PropTypes.array,
      link: PropTypes.array,
      script: PropTypes.array,
      style: PropTypes.array,
    }),
    title: PropTypes.string,
    updateHistoryState: PropTypes.func,
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
    title: '',
    updateHistoryState: () => {},
    viewTop: true,
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
   * Sets the navigator title when the component mounts.
   */
  componentDidMount() {
    this.props.updateHistoryState({
      title: this.props.title || '',
      viewTop: true,
    });
  }

  /**
   * Sets the new navigator title if it has changed.
   * @param {Object} nextProps The new component props.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.title !== this.props.title) {
      this.props.updateHistoryState({
        title: nextProps.title || this.props.title || '',
        viewTop: this.props.viewTop,
      });
    }

    if (nextProps.viewTop && nextProps.viewTop !== this.props.viewTop) {
      // Scroll to top
      this.element.scrollTop = 0;
    }
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
   * Handles the scroll event of this component's element.
   */
  handleScroll = throttle(() => {
    if (!this.element) {
      return;
    }

    const isViewTop = this.element.scrollTop === 0;

    if (isViewTop !== this.props.viewTop) {
      this.props.updateHistoryState({
        title: this.props.title || '',
        viewTop: isViewTop,
      });
    }
  }, 100);

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
    let style = styles.container(this.props.hasNavigator);

    if (!this.props.viewTop) {
      style += ` ${styles.containerShaded}`;
    }

    return (
      <Swipeable
        onSwiped={this.handleSwipe}
        flickThreshold={0.6}
        delta={10}
      >
        <article
          className={style}
          ref={(ref) => { this.element = ref; }}
          onScroll={this.handleScroll}
        >
          {this.renderMetaTags()}
          {this.props.children}
        </article>
      </Swipeable>
    );
  }
}

export default connect(ViewContent);
