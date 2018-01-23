/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import BasicDialog from '../BasicDialog';

/**
 * The number of taps required until the dialog switches to/from developer mode.
 */
const requiredTapsToSwitchModes = 10;

/**
 * The timeout between repeated tapping on the message (in ms).
 */
const switchModeTapTimeout = 4000 / requiredTapsToSwitchModes;

/**
 * This component displays a pipeline error dialog.
 * The special behaviour of this message is that the user may tap the message body
 * ten times until it reveals additional information about the error that occured.
 */
class PipelineErrorDialog extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(
      PropTypes.shape()
    ).isRequired,
    params: PropTypes.shape({
      errorCode: PropTypes.string, // The error code as string.
      message: PropTypes.string.isRequired, // The error message reported by the pipeline.
      pipelineName: PropTypes.string.isRequired, // The identifier of the pipeline.
      request: PropTypes.shape.isRequired, // The request as sent to the server.
    }).isRequired,
    message: PropTypes.string,
  };

  static defaultProps = {
    message: '',
  };

  /**
   * Creates the component.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.tapTimeout = null;
    this.tapCounter = 0;

    this.state = {
      devMode: false, // Indicating whether we are in dev mode.
    };
  }

  /**
   * Clears the tap counter once the
   */
  handleTapTimeout = () => {
    this.tapCounter = 0;
  };

  /**
   * User tapped the message, increase the tap counter and switch view modes if required.
   */
  handleClick = () => {
    this.tapCounter += 1;

    if (this.tapTimeout) {
      // Clear the timeout.
      clearTimeout(this.tapTimeout);
    }

    if (this.tapCounter >= requiredTapsToSwitchModes) {
      // Switch modes and reset the tap counter.
      this.tapCounter = 0;

      this.setState({
        devMode: !this.state.devMode,
      });
    } else {
      this.tapTimeout = setTimeout(this.handleTapTimeout, switchModeTapTimeout);
    }
  };

  /**
   * @return {string} The title based on the current state of the dialog.
   */
  get title() {
    return this.state.devMode
      ? 'Pipeline Error'
      : 'modal.title_error';
  }

  /**
   * @return {JSX} The content component based on the the current state of the dialog.
   */
  get content() {
    return this.state.devMode
      ? this.renderDevErrorMessage(this.props.params)
      : this.renderUserErrorMessage();
  }

  /**
   * Renders the error message in developer mode.
   * @param {Object} params The message parameters.
   * @returns {JSX}
   */
  renderDevErrorMessage = params => (
    <div aria-hidden>
      <p>
        <strong>pipelineRequest:</strong> {params.pipelineName}
        <br />
        {params.errorCode && <strong>{params.errorCode}: </strong>}
        {params.message}
      </p>
      <p>
        <strong>Request:</strong>
        <br />
        {JSON.stringify(params.request, null, ' ')}
      </p>
    </div>
  );

  /**
   * Renders the regular error message in user mode.
   * @returns {JSX}
   */
  renderUserErrorMessage = () => (
    <I18n.Text string={this.props.message || 'modal.body_error'} />
  );

  /**
   * Renders the error message depending on the current mode.
   * @return {JSX}
   */
  render() {
    return (
      <BasicDialog title={this.title} actions={this.props.actions}>
        <div aria-hidden onClick={this.handleClick}>
          {this.content}
        </div>
      </BasicDialog>
    );
  }
}

export default PipelineErrorDialog;
