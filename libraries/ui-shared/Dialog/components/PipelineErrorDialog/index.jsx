import React, {
  useState, useRef, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
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
 * Checks the input to be truthy, "0" or "false" and enables it to be rendered then.
 * @param {Object|string|number|boolean} value The value to be checked if it should be rendered.
 * @returns {boolean}
 */
const checkValue = value => !!value || value === 0 || value === false;

/**
 * This component displays a pipeline error dialog.
 * The special behavior of this message is that the user may tap the message body
 * ten times until it reveals additional information about the error that occurred.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const PipelineErrorDialog = ({ actions, params, message }) => {
  const [devMode, setDevMode] = useState(false);
  const tapTimeoutRef = useRef(null);
  const tapCounterRef = useRef(0);

  const handleTapTimeout = useCallback(() => {
    tapCounterRef.current = 0;
  }, []);

  const handleClick = useCallback(() => {
    tapCounterRef.current += 1;

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    if (tapCounterRef.current >= requiredTapsToSwitchModes) {
      tapCounterRef.current = 0;
      setDevMode(prev => !prev);
    } else {
      tapTimeoutRef.current = setTimeout(handleTapTimeout, switchModeTapTimeout);
    }
  }, [handleTapTimeout]);

  useEffect(() => () => {
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
  }, []);

  const title = devMode ? 'Pipeline Error' : 'modal.title_error';

  /**
   * @returns {JSX.Element}
   */
  const renderDevErrorMessage = () => (
    <div aria-hidden>
      <span>
        <strong>Pipeline:</strong>
        <span>{` ${params.pipeline}`}</span>
        <br />
      </span>
      { checkValue(params.entityId) && (
        <span>
          <strong>Entity id:</strong>
          <span>{` ${params.entityId}`}</span>
          <br />
        </span>
      )}
      { checkValue(params.code) && (
        <span>
          <strong>Code:</strong>
          <span>{` ${params.code}`}</span>
          <br />
        </span>
      )}
      <span>
        <strong>Message:</strong>
        <span>{` ${params.message}`}</span>
        <br />
      </span>
      { checkValue(params.translated) && (
        <span>
          <strong>Message Translated:</strong>
          <span>{` ${params.translated.toString()}`}</span>
          <br />
        </span>
      )}
      { checkValue(params.messageParams) && (
        <p>
          <strong>Message Params:</strong>
          <br />
          <span>{JSON.stringify(params.messageParams, null, ' ')}</span>
          <br />
        </p>
      )}
      { checkValue(params.request) && (
        <p>
          <strong>Request Params:</strong>
          <br />
          <span>{JSON.stringify(params.request, null, ' ')}</span>
          <br />
        </p>
      )}
    </div>
  );

  /**
   * @returns {JSX.Element}
   */
  const renderUserErrorMessage = () => (
    <>
      { !!params.translated && (
        message || params.message || <I18n.Text string="modal.body_error" />
      )}
      { !params.translated && (
        <I18n.Text
          string={message || params.message || 'modal.body_error'}
          params={params.messageParams || {}}
        />
      )}
    </>
  );

  const content = devMode ? renderDevErrorMessage() : renderUserErrorMessage();

  return (
    <BasicDialog title={title} actions={actions}>
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
      <div onClick={handleClick}>
        {content}
      </div>
    </BasicDialog>
  );
};

PipelineErrorDialog.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  params: PropTypes.shape({
    entityId: PropTypes.string,
    code: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    message: PropTypes.string.isRequired,
    messageParams: PropTypes.shape(),
    translated: PropTypes.bool,
    pipeline: PropTypes.string.isRequired,
    request: PropTypes.shape(),
  }).isRequired,
  message: PropTypes.string,
};

PipelineErrorDialog.defaultProps = {
  message: '',
};

export default PipelineErrorDialog;
