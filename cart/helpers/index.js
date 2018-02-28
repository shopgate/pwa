import { PIPELINE_RESPONSE_MESSAGE_TYPE_ERROR } from '../constants';

/**
 * Checks if the messages array of a pipeline response contains error messages.
 * @param {Array} [messages=[]] The messages.
 * @return {boolean}
 */
export const messagesHaveErrors = (messages = []) =>
  messages.some(({ type }) => type === PIPELINE_RESPONSE_MESSAGE_TYPE_ERROR);
