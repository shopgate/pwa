/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HISTORY_POP_ACTION } from '@shopgate/pwa-common/constants/History';
import { KeyframeAnimation } from '@shopgate/pwa-common/components/KeyframeAnimation';
import connect from '../../../../connector';
import styles from './style';

/**
 * The Navigator Title component.
 */
class Title extends Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    historyLength: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: () => {},
  };

  /**
   * The constructor.
   * Sets the initial state from connected props.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.previousTitle = null;
    this.title = props.title;
  }

  /**
   * Checks if the title was reset and if the component should update.
   * @param {Object} nextProps The next incoming props.
   * @returns {boolean} Whether the component should update.
   */
  shouldComponentUpdate(nextProps) {
    return (this.props.title !== nextProps.title) && nextProps.title;
  }

  /**
   * When the component updates, preserve the current title.
   * @param {Object} nextProps The components next props.
   */
  componentWillUpdate(nextProps) {
    this.previousTitle = this.title;
    this.title = nextProps.title;
  }

  /**
   * Determine how the views should be displayed.
   * @returns {JSX}
   */
  get transitionClass() {
    // For the first page don't do any animation.
    if (this.props.historyLength === 1) {
      return {
        inactive: '',
        active: '',
      };
    }

    const pop = this.props.action === HISTORY_POP_ACTION;

    return {
      inactive: pop ? styles.centerToRight : styles.centerToLeft,
      active: pop ? styles.leftToCenter : styles.rightToCenter,
    };
  }

  /**
   * Renders the component.
   * Displays the Title.
   * @returns {JSX}
   */
  render() {
    return (
      <div aria-hidden onClick={this.props.onClick}>
        {/* Renders the inactive / previous title */}
        <KeyframeAnimation
          className={styles.title}
          activeClass={this.transitionClass.inactive}
          inactiveClass={styles.hidden}
        >
          {this.previousTitle}
        </KeyframeAnimation>

        {/* Renders the active / current title */}
        <KeyframeAnimation
          className={styles.title}
          activeClass={this.transitionClass.active}
        >
          {this.props.title}
        </KeyframeAnimation>
      </div>
    );
  }
}

export default connect(Title);
