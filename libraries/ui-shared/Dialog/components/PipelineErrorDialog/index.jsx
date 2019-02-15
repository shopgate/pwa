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
    actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    params: PropTypes.shape({
      entityId: PropTypes.string,
      code: PropTypes.string, // The error code as string.
      message: PropTypes.string.isRequired, // The error message reported by the pipeline.
      messageParams: PropTypes.shape(), // A list of key/value pairs (paramName: paramValue)
      translated: PropTypes.bool,
      pipeline: PropTypes.string.isRequired, // The identifier of the pipeline.
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
    return this.state.devMode ? this.renderDevErrorMessage() : this.renderUserErrorMessage();
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
   * Renders the error message in developer mode.
   * @returns {JSX}
   */
  renderDevErrorMessage = () => {
    const { params } = this.props;

    return (
      <div aria-hidden>
        <strong>Pipeline:</strong> {params.pipeline}<br />
        { params.entityId && (
          <span>
            <strong>Entity id: </strong> {params.entityId} <br />
          </span>
        )}
        { params.code && (
          <span>
            <strong>Code: </strong> {params.code} <br />
          </span>
        )}
        <strong>Message:</strong> {params.message} <br />
        { params.messageParams && (
          <p>
            <strong>Message Params:</strong><br />
            {JSON.stringify(params.messageParams, null, ' ')}
          </p>
        )}
        { params.translated && (
          <span>
            <strong>Message Translated: </strong> {params.translated.toString()} <br />
          </span>
        )}
        <p>
          <strong>Request Params:</strong><br />
          {JSON.stringify(params.request, null, ' ')}
        </p>
      </div>
    );
  }

  /**
   * Renders the regular error message in user mode.
   * @returns {JSX}
   */
  renderUserErrorMessage = () => {
    const { message = '', params = {} } = this.props;

    return (
      <React.Fragment>
        {params.translated === true && (
          message || params.message || 'modal.body_error'
        )}
        {params.translated !== true && (
          <I18n.Text
            string={message || params.message || 'modal.body_error'}
            params={params.messageParams || {}}
          />
        )}
      </React.Fragment>
    );
  }

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
