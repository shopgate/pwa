/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import Drawer from '@shopgate/pwa-common/components/Drawer';
import Header from './components/Header';
import styles from './style';

/**
 * Sheet component.
 */
class Sheet extends Component {
  static Header = Header;

  /**
   * The component prop types.
   * @type {Object}
   */
  static propTypes = {
    animation: PropTypes.shape({
      in: PropTypes.string,
      out: PropTypes.string,
    }),
    backdrop: PropTypes.bool,
    children: PropTypes.node,
    duration: PropTypes.number,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    title: PropTypes.string,
  };

  /**
   * The component default props.
   * @type {Object}
   */
  static defaultProps = {
    animation: {},
    backdrop: true,
    children: null,
    duration: 300,
    isOpen: false,
    onClose: null,
    onOpen: () => {},
    title: '',
  };

  /**
   * The constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.mounted = false;
    this.state = {
      isOpen: props.isOpen,
    };
  }

  /**
   * Set flag when component mounts.
   */
  componentDidMount() {
    this.mounted = true;
  }

  /**
   * Change isOpen state for new incoming props.
   * @param {Object} nextProps Next Props
   */
  componentWillReceiveProps(nextProps) {
    if (this.state.isOpen !== nextProps.isOpen) {
      this.setState({ isOpen: nextProps.isOpen });
    }
  }

  /**
   * Only update when the state is changed.
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.isOpen !== nextState.isOpen ||
      nextProps.children !== this.props.children
    );
  }

  /**
   * Getter for the animation props of the Sheet.
   * @returns {Object}
   */
  get animationProps() {
    return {
      duration: this.props.duration,
      ...styles.drawerAnimation,
      ...this.props.animation,
    };
  }

  /**
   * Close the Sheet.
   */
  handleClose = () => {
    this.setState({ isOpen: false });
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const child = Children.toArray(this.props.children)[0];
    const processedChild = child ? (
      React.cloneElement(
        child,
        // Only add onClose prop to other components
        typeof child.type === 'function' && this.props.onClose !== null ? (
          { onClose: this.props.onClose }
        ) : {}
      )
    ) : null;

    return (
      <section>
        <Drawer
          className={styles.container}
          isOpen={this.state.isOpen}
          onOpen={this.props.onOpen}
          onClose={this.props.onClose}
          animation={this.animationProps}
        >
          {this.props.title &&
            <Sheet.Header title={this.props.title} onToggleClose={this.handleClose} />
          }
          <div className={`${styles.content} ${!this.props.backdrop && styles.shadow}`}>
            {processedChild}
          </div>
        </Drawer>
        {this.props.backdrop &&
          <Backdrop
            isVisible={this.state.isOpen}
            level={3}
            onClick={this.handleClose}
            opacity={20}
          />
        }
      </section>
    );
  }
}

export default Sheet;
