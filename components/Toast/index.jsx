/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from '../Drawer';
import connect from './connector';

/**
 * Toast component.
 */
class Toast extends Component {
  static propTypes = {
    container: PropTypes.func.isRequired,
    // CreateToast: PropTypes.func.isRequired.
    message: PropTypes.func.isRequired,
    removeToast: PropTypes.func.isRequired,
    className: PropTypes.string,
    toast: PropTypes.shape(),
  };

  static defaultProps = {
    toast: null,
    className: null,
  };

  /**
   * Constructs.
   * @param {Object} props Props.
   */
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.activeToast = 0;
    this.timeout = null;
  }

  /**
   * ComponentWillReceiveProps.
   * @param {Object} nextProps NextProps.
   */
  componentWillReceiveProps(nextProps) {
    const hasToast = !!nextProps.toast;
    if (
      hasToast
      && this.activeToast === nextProps.toast.id
    ) {
      return;
    }
    if (hasToast) {
      this.activeToast = nextProps.toast.id;
    }

    const wasOpen = this.state.isOpen;
    const willBeOpen = !!this.activeToast;
    if (hasToast && !wasOpen && willBeOpen) {
      this.handleTimeout(nextProps.toast);
    }
    if (wasOpen !== willBeOpen) {
      this.setState({
        isOpen: willBeOpen,
      });
    }
  }

  /**
   * Executed when Drawer calls onClose callback.
   * Calls handleRemoveMessage to proceed with removal.
   */
  handleOnDrawerClose = () => {
    this.handleRemoveMessage();
  };

  /**
   * Closes Drawer or removes the message when drawer is closed.
   */
  handleRemoveMessage = () => {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false,
      });
      return;
    }
    if (this.props.toast) {
      this.props.removeToast(this.props.toast.id);
    }
  };

  /**
   * Handles timeout.
   * @param {Object} toast Toast.
   */
  handleTimeout = (toast) => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.handleRemoveMessage();
    }, toast.timeout);
  };

  /**
   * Renders.
   * @returns {XML}
   */
  render() {
    // Window.foo = this.props.createToast.
    const Container = this.props.container;
    const Message = this.props.message;

    return (
      <Drawer
        isOpen={!!this.props.toast}
        onDidClose={this.handleOnDrawerClose}
        onClose={this.handleOnDrawerClose}
        className={this.props.className}
      >
        {
          this.props.toast &&
          <Container>
            <Message text={this.props.toast.message} />
          </Container>
        }
      </Drawer>
    );
  }
}

export default connect(Toast);
