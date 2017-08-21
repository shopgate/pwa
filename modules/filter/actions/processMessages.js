import logger from '@shopgate/pwa-core/classes/Logger';
import { showModal } from 'Library/actions/modals';

/**
 * Processes messages, which came within cart related pipeline responses, e.g. opens an error modal.
 * @param {Function} dispatch The Redux action dispatcher.
 * @param {Array} messages The messages.
 * @param {string} pipeline The name of the pipeline that sent the message(s).
 */
const processMessages = (dispatch, messages, pipeline) => {
  if (Array.isArray(messages) && messages.length) {
    messages.forEach((entry) => {
      const { message } = entry;

      // By now all pipeline response messages are handled as an error
      dispatch(showModal({
        confirm: null, // Do not show the confirm button.
        title: 'modal.title_error',
        message,
      }));
      // Logging for further analysis
      logger.warn(`Message (${pipeline}): `, entry);
    });
  }
};

export default processMessages;
